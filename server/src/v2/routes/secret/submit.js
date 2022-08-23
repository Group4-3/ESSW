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
import fs from 'fs';
import createHash from 'crypto-js';  

const SECRET_STORAGE_DIRECTORY = '.';

async function generateChecksum(content, algorithm = 'sha256') { //Returns a checksum of the content, using the supplied algorithm (defaults to sha256)
  // return createHash.update(content).digest("hex") 
  return createHash(algorithm)
    .update(content)
    .digest('base64'); //Return base64 filename, for compactness
}

function writeSecret(secret_id, secret_content) {
  var secret_hash = generateChecksum('secret_content');//, 'sha256'); //Use default sha256
  var secret_path = `${ SECRET_STORAGE_DIRECTORY }/${secret_id}/${ secret_hash }`;
  try {
    fs.promises.writeFile(secret_path, secret_content);
  }
  catch (err) {
    return next({success:false, error: err, error_messsage:`Unable to write file '${secret_path}': ${err}.`});
  }
  finally {
    return next({ success: true });
  }
}

export async function secretSubmit(req, res, next) {
  const METHODS = cipher.methods
  const DEFAULT_METHOD = 'aes'
  const DEFAULT_EXPIRY = 86400 // 1 day
  const MAX_EXPIRY = 604800    // 7 days

  try {
    if (!req.body.body)
      return next({message: 'Missing required body param: `body`.'})
    var body = textUtils.escape(req.body.body.toString())

    if (!req.body.passphrase)
      return next({message: 'Missing required body param: `passphrase`.'})
    var passphrase = req.body.passphrase.toString()

    if (req.body.method && !METHODS.includes(req.body.method))
      return next({message: 'Param `method` must be one of: ' + METHODS.join(', ')})
    var method = req.body.method ? req.body.method.toLowerCase() : DEFAULT_METHOD

    if (req.body.expiry && !Number.isInteger(parseInt(req.body.expiry))
        || parseInt(req.body.expiry) < 0
        || parseInt(req.body.expiry) > MAX_EXPIRY)
      return next({message: 'Param `expiry` must be an integer between 0 and ' + MAX_EXPIRY})
    var expiryOffset = req.body.expiry ? parseInt(req.body.expiry) : DEFAULT_EXPIRY
    var expiry_date = new Date(Date.now() + expiryOffset*1000).toISOString()

    var pwned = await pwnedPassphrase(passphrase)
    if (pwned)
      return next({message: 'Passphrase has been pwned (leaked online); please use something else.'})

    var encrypted_body = cipher.encrypt(body, passphrase, method)
    if (!encrypted_body)
      return next({message: 'Your message could not be encrypted; please try again checking your parameters are correct.'})

    var hashed_passphrase = await bcrypt.hash(passphrase, 10).then(result => {
      return result
    })
    
    
    var id = cipher.generateIdentifier();
    var filestore = writeSecret(id, encrypted_body);
    var transaction = db.addSecret({
      secret_id: id,
      secret_text: encrypted_body, //TODO:Alter 'secret text' to be appropriate file metadata
      passphrase: hashed_passphrase,
      expiry_date: expiry_date,
      method: method
    })

    
    if (transaction.success && filestore.success) {
      return res.status(200).send({id: id})
    } 
    else if (transaction.success && !filestore.success) {
      return next({message: `Unable to write secret to file: ${filestore.err}`});
    }
    else if (!transaction.success && filestore.success) {
      return next({message: `Unable to write secret to database: ${err}`});
    }
    else {
      return next({message: 'Secret Storage Failure.'})
    }
  } catch (err) {
    return next({status: 500, error: err})
  }
}
