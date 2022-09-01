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
import * as file from '../../modules/file.js'
  

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

    //TODO: File Upload functionality (multiple)
    var upload_multiple_files = {files : []}; // {files : [{name : 'temp_name', content : 'This is a temp message. If this ends up in production, something has gone horribly, horribly wrong.'},
  //{name : 'other_file', content : 'Rending skin from bones'}]}; //TempVar to allow for multiple file uploads. Should be in JSON array format. (Get file modification time?)
    
    //JSON structure requires file name (no path, just name), and content. Name should include extension.

    var file_metadata = {files : []};

    upload_multiple_files.files.forEach(upload_file => {
      let file_name = upload_file.name;
      let file_content = upload_file.content;

      let encrypted_file_content = cipher.encrypt(file_content, passphrase, method);

      if (!encrypted_file_content)
        return next({status : 500, error: "File encryption error!"});

      let file_write_result = file.writeSecret(id, encrypted_file_content);

      if (file_write_result.success) { //If the file write succeeds
        file_metadata.files.push({original_file_name : file_name, encrypted_file_name : file_write_result.name, encrypted_file_path : file_write_result.path}); //Add file metadata to array
      } 
      else {
        return next({status: 500, error: file_write_result.err});
      }
    });
    
    // var filestore = file.writeSecret(id, encrypted_body);
    var transaction = db.addSecret({
      secret_id: id,
      file_metadata: filestore.secret_path,
      secret_text: encrypted_body,
      passphrase: hashed_passphrase,
      expiry_date: expiry_date,
      method: method
    })

    
    if (transaction.success) { //TODO: Rewrite to vary error behaviour based on processing path (file, text, or both?)
      return res.status(200).send({id: id})
    } 
    else if (!transaction.success) {
      return next({message: `Unable to write secret to database: ${err}`});
    }
    else {
      return next({message: 'Secret Storage Failure.'})
    }
  } catch (err) {
    return next({status: 500, error: err})
  }
}
