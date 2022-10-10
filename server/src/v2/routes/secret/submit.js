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
  const METHODS_NO_PASSPHRASE = ['publickey']
  const DEFAULT_METHOD = 'aes'
  const DEFAULT_EXPIRY = 1800 // 30 minutes
  const MAX_EXPIRY = 604800   // 7 days
  const DEFAULT_ACCESS_ATTEMPTS = 5
  const SECRET_SIZE_LIMIT = process.env.MAXIMUM_BODY_SIZE ? file.humanUnreadableSize(process.env.MAXIMUM_BODY_SIZE) : 2097152 // default to 2MiB in bytes

  try {
    var secretId = cipher.generateIdentifier()

    if (!hasProperty(req.body, 'text') && !(req.files && Object.keys(req.files).length))
      return next({message: 'Missing required body param: `text` OR `file` (must use one).'})

    if (hasProperty(req.body, 'method') && !METHODS.includes(req.body.method))
      return next({message: 'Param `method` must be one of: ' + METHODS.join(', ')})
    var method = hasProperty(req.body, 'method') ? req.body.method.toLowerCase() : DEFAULT_METHOD
    var usingPassphraselessMethod = METHODS_NO_PASSPHRASE.includes(method)

    // passphrase referes to both the password and public key if the public key item is selected
    if (!hasProperty(req.body, 'passphrase'))
      return next({message: 'Missing required body param: `passphrase`.'})
    var passphrase = req.body.passphrase.toString()

    if (method === 'publickey') {
      var pubkeyRegex = /-{5}BEGIN PUBLIC KEY-{5}.*-{5}END PUBLIC KEY-{5}/s
      if (!pubkeyRegex.test(passphrase))
        return next({message: 'Public key format does not match the format of X.509 SubjectPublicKeyInfo/OpenSSL PEM public key.'})
    }

    if (hasProperty(req.body, 'allow_insecure_passphrase') && !isBooleanProperty(req.body.allow_insecure_passphrase))
      return next({message: 'Param `allow_insecure_passphrase` must be of type Boolean.'})
    var allowInsecurePassphrase = hasProperty(req.body, 'allow_insecure_passphrase') ? parseInsecureBoolean(req.body.allow_insecure_passphrase) : false

    // check if the Method being used requires a passphrase
    if (!(allowInsecurePassphrase || usingPassphraselessMethod)) {
      var pwned = await pwnedPassphrase(passphrase)
      if (pwned)
        return next({message: 'Passphrase has been pwned (leaked online); please use something else.'})
    }

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

    var text = hasProperty(req.body, 'text') ? textUtils.escape(req.body.text.toString()) : ' '
    var encryptedText = cipher.encrypt(text, passphrase, method)

    if (!encryptedText)
      return next({message: 'Your message could not be encrypted; please try again checking your parameters are correct.'})

    var fileMetadata = []
    var totalFileSize = 0
    if (req.files && Object.keys(req.files).length) {
      if (method === 'publickey')
        return next({message: 'File upload is not supported by public key encryption.'})

      if (typeof req.files !== 'object')
        return next({message: 'Files must be a multer object.'})

      for (var i = 0; i < req.files.length; i++) {
        var f = req.files[i]

        // check whether total file size is over limit
        // if so, we drop the secret and delete any files we've stored
        totalFileSize += f.buffer.length
        if (totalFileSize > SECRET_SIZE_LIMIT) {
          file.deleteSecretFileDirectory(secretId)
          return next({message: `Total uploaded files in secret exceeds maximum size of ${file.humanReadableSize(SECRET_SIZE_LIMIT)}.`})
        }

        var originalName = f.originalname
        var encryptedFileName = cipher.encrypt(originalName, passphrase, method)

        var savedFile = await file.writeSecretFile(f.buffer, passphrase, method, secretId)
        if (!savedFile.success)
          return next({status: 500, message: 'Unable to save encrypted file to disk.', error: savedFile.error})

        fileMetadata.push({
          encrypted_file_name: encryptedFileName,
          encoding: f.encoding,
          mimetype: f.mimetype,
          size: f.size,
          checksum: savedFile.checksum,
          location: savedFile.path
        })
      }
    }
    fileMetadata = JSON.stringify(fileMetadata)

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
