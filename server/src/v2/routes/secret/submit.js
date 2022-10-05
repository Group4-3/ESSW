/*
    ----- GROUP 43 Header -----
    Component Name: Secret/Submit
    Description: Validates, encrypts, and persists a given secret into storage
    Date of Creation: 28/05/2022
    Author(s): Petri Bayley, Mitchell Sundstrom
*/

import bcrypt from 'bcrypt'
import * as db from '../../modules/db.js'
import * as cipher from '../../helpers/cipher.js'
import * as textUtils from '../../helpers/text.js'
import { pwnedPassphrase } from '../../helpers/pwned.js'
import { hasProperty, isBooleanProperty, parseInsecureBoolean } from '../../helpers/validation.js'
import * as file from '../../modules/file.js'


export async function secretSubmit(req, res, next) {
  const METHODS = cipher.methods
  const DEFAULT_METHOD = 'aes'
  const DEFAULT_EXPIRY = 1800 // 30 minutes
  const MAX_EXPIRY = 604800   // 7 days
  const DEFAULT_ACCESS_ATTEMPTS = 5

  try {
    var secretId = cipher.generateIdentifier()

    if (!hasProperty(req.body, 'text') && !(req.files && Object.keys(req.files).length))
      return next({message: 'Missing required body param: `text` OR `file` (must use one).'})

    if (!hasProperty(req.body, 'passphrase'))
      return next({message: 'Missing required body param: `passphrase`.'})
    var passphrase = req.body.passphrase.toString()

    if (hasProperty(req.body, 'allow_insecure_passphrase') && !isBooleanProperty(req.body.allow_insecure_passphrase))
      return next({message: 'Param `allow_insecure_passphrase` must be of type Boolean.'})

    var allowInsecurePassphrase = hasProperty(req.body, 'allow_insecure_passphrase') ? parseInsecureBoolean(req.body.allow_insecure_passphrase) : false

    var pwned = await pwnedPassphrase(passphrase)
    if (pwned && !allowInsecurePassphrase)
      return next({message: 'Passphrase has been pwned (leaked online); please use something else.'})

    if (hasProperty(req.body, 'method') && !METHODS.includes(req.body.method))
      return next({message: 'Param `method` must be one of: ' + METHODS.join(', ')})
    var method = hasProperty(req.body, 'method') ? req.body.method.toLowerCase() : DEFAULT_METHOD

    if (hasProperty(req.body, 'expiry') && !Number.isInteger(parseInt(req.body.expiry))
    || parseInt(req.body.expiry) < 0
    || parseInt(req.body.expiry) > MAX_EXPIRY)
      return next({message: 'Param `expiry` must be an integer between 0 and ' + MAX_EXPIRY + '.'})
    var expiryOffset = hasProperty(req.body, 'expiry') ? parseInt(req.body.expiry) : DEFAULT_EXPIRY
    var expiryDate = new Date(Date.now() + expiryOffset*1000).toISOString()

    if (hasProperty(req.body, 'max_access_attempts') && !Number.isInteger(parseInt(req.body.max_access_attempts))
    || parseInt(req.body.max_access_attempts) < -1)
      return next({message: 'Param `max_access_attempts` must be a positive integer (or use -1 for infinite).'})

    if (hasProperty(req.body, 'ip_based_access_attempts') && !isBooleanProperty(req.body.ip_based_access_attempts))
      return next({message: 'Param `ip_based_access_attempts` must be of type Boolean.'})

    if (typeof req.body.ip_based_access_attempts === 'string')
      req.body.ip_based_access_attempts = req.body.ip_based_access_attempts === 'true' ? true : false

    var unauthorizedAttempts = JSON.stringify({
      max_attempts: hasProperty(req.body, 'max_access_attempts') ? parseInt(req.body.max_access_attempts) : DEFAULT_ACCESS_ATTEMPTS,
      ip_based: hasProperty(req.body, 'ip_based_access_attempts') ? parseInsecureBoolean(req.body.ip_based_access_attempts) : false,
      attempts: hasProperty(req.body, 'ip_based_access_attempts') ? {} : 0
    })

    var text = hasProperty(req.body, 'text') ? textUtils.escape(req.body.text.toString()) : ''
    var encryptedText = cipher.encrypt(text, passphrase, method)
    if (!encryptedText)
      return next({message: 'Your message could not be encrypted; please try again checking your parameters are correct.'})

    var fileMetadata = [];
    if (req.files && Object.keys(req.files).length) {
      if (typeof req.files !== 'object')
        return next({message: 'Files must be a multer object.'})

      for (var i = 0; i < req.files.length; i++) {
        var f = req.files[i]
        var originalName = f.originalname
        var encryptedFileName = cipher.encrypt(originalName, passphrase, method)

        var savedFile = await file.writeSecretFile(f.buffer, passphrase, method, secretId, i)
        if (!savedFile.success) {
          return next({status: 500, message: 'Unable to save encrypted file to disk.', error: savedFile.error})
        }

        fileMetadata.push({
          encrypted_file_name: encryptedFileName,
          encoding: f.encoding,
          extension: originalName.substring(originalName.lastIndexOf('.')+1, originalName.length) || "",
          mimetype: f.mimetype,
          size: f.size,
          checksum: savedFile.checksum,
          location: savedFile.path
        })
      }
    }
    fileMetadata = fileMetadata.length > 0 ? JSON.stringify(fileMetadata) : "";

    var hashedPassphrase = await bcrypt.hash(passphrase, 10).then(result => {
      return result
    })

    var transaction = db.addSecret({
      secret_id: secretId,
      secret_text: encryptedText,
      file_metadata: fileMetadata,
      passphrase: hashedPassphrase,
      expiry_date: expiryDate,
      method: method,
      unauthorized_attempts: unauthorizedAttempts
    })

    if (transaction.success) {
      return res.status(200).send({
        id: secretId,
        expires_at: expiryDate
      })
    } else {
      return next({status: 500, message: 'Unable to save secret.', error: transaction.error})
    }
  } catch (err) {
    return next({status: 500, error: err.message})
  }
}
