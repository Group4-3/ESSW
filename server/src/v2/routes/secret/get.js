/*
    ----- GROUP 43 Header -----
    Component Name: Secret/Get
    Description: Retrieve a secret given an ID and valid passphrase
    Date of Creation: 02/06/2022
    Author(s): Petri Bayley, Mitchell Sundstrom
*/

import bcrypt from 'bcrypt'
import * as db from '../../modules/db.js'
import * as cipher from '../../helpers/cipher.js'
import * as ipHelper from '../../helpers/ip.js'
import * as secretHelper from '../../helpers/secret.js'
import { hasProperty } from '../../helpers/validation.js'
import * as file from '../../modules/file.js'

export async function secretGet(req, res, next) {
  try {
    var remoteIp = ipHelper.getRemoteIp(req)

    if (!hasProperty(req.params, 'id'))
      return next({message: 'Missing required request param: `id`.'})
    var id = req.params.id

    var row = await db.retrieveSecret(id)
    if (!row.data || row.data && Date.parse(row.data.expiry_date) < Date.now())
      return next({status: 404, message: 'Secret with that ID does not exist or has been deleted.'})

    var secret = row.data

    if (!secretHelper.canAttemptAccess(secret, remoteIp))
      return next({status: 429, message: 'Too many unsuccessful access attempts; the requested secret is locked.'})

    if (!hasProperty(req.body, 'passphrase'))
      return next({message: 'Missing required body param: `passphrase`.'})
    var passphrase = req.body.passphrase.toString()

    if (bcrypt.compareSync(passphrase.replace(/(?:\r\n|\r|\n)/g, ''), secret.passphrase)) {
      var decryptedText = cipher.decrypt(secret.secret_text, passphrase, secret.method)

      var decryptedFiles = []
      var fileList = JSON.parse(secret.secret_file_metadata)

      for (var i = 0; i < fileList.length; i++) {
        var targetFile = fileList[i]
        var fileName = cipher.decrypt(targetFile.encrypted_file_name, passphrase, secret.method)
        var readFile = await file.readSecretFile(targetFile.location, passphrase, secret.method)

        if (!readFile.success) {
          return next ({status: 500, message: 'Unable to read encrypted file from disk.', error: readFile.error})
        }

        // FIXME
        // this isn't comparing the right things and needs to be looked into
        //
        // if (targetFile.checksum !== cipher.generateChecksum(readFile.content.toString())) {
        //   return next ({status: 500, error: 'Decrypted file checksum does not match the expected hash; has there been some tampering?'})
        // }

        targetFile.file_name = fileName
        targetFile.blob = readFile.content

        // delete internal properties
        delete targetFile.location
        delete targetFile.encrypted_file_name

        decryptedFiles.push(targetFile)
      }

      db.deleteSecret(id)

      return res.status(200).send({text: decryptedText, files: decryptedFiles})
    } else {
      db.updateUnauthorizedAttempts(secret.id, secretHelper.incrementUnauthorizedAttempt(secret, remoteIp))

      return next({status: 401, message: 'Unauthorized.'})
    }
  } catch (err) {
    return next({status: 500, error: err.message})
  }
}
