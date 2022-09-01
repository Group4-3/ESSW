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
import * as textUtils from '../../helpers/text.js'
import * as file from '../../modules/file.js'

export async function secretGet(req, res, next) {
  try {
    if (!req.params.id)
      return next({message: 'Missing required request param: `id`.'})
    var id = req.params.id

    if (!req.body.passphrase)
      return next({message: 'Missing required body param: `passphrase`.'})
    var passphrase = req.body.passphrase.toString()

    var row = await db.retrieveSecret(id)
    if (!row.data)
      return next({status: 404, message: 'Secret with that ID does not exist or has been deleted.'})
    row = row.data
    var encrypted_files = row.file_metadata;
    
    if(bcrypt.compareSync(passphrase, row.passphrase)) {
      var decrypted_body = cipher.decrypt(row.secret_text, passphrase, row.method)
      var decrypted_files = [];
      
      //Read uploaded files
      if (encrypted_files.files >= 1) { //Only decrypt if there are files to decrypt.
        encrypted_files.files.forEach(stored_file => {
          let file_name = stored_file.original_file_name;
          let encrypted_file_content = file.readSecret(stored_file.path); //Read file secret, from given filename
          
          let file_content = cipher.decrypt(encrypted_file_content, passphrase, row.method); //Decrypt using file content
          if (!file_content) //Error if file decryption fails for some reason
            return next({status : 500, message: 'File decryption error.'});
          
          decrypted_files.files.push({name : file_name, content : file_content});
        });
      }

      db.deleteSecret(id)
      return res.status(200).send({body: decrypted_body, files : decrypted_files})
    } else {
      return next({status: 401, message: 'Unauthorized.'})
    }
  } catch (err) {
    return next({status: 500, error: err})
  }
}
