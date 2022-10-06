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

    if (!hasProperty(req.body, 'id'))
      return next({message: 'Missing required request param: `id`.'})
    var id = req.params.id

    var row = await db.retrieveSecret(id)
    if (!row.data || row.data && Date.parse(row.data.expiry_date) < Date.now())
      return next({status: 404, message: 'Secret with that ID does not exist or has been deleted.'})

    row = row.data
    var file_metadata = row.secret_file_metadata;

    if (!secretHelper.canAttemptAccess(row, remoteIp))
      return next({status: 429, message: 'Too many unsuccessful access attempts; the requested secret is locked.'})

    if (!hasProperty(req.body, 'passphrase'))
      return next({message: 'Missing required body param: `passphrase`.'})
    var passphrase = req.body.passphrase.toString()

    if(bcrypt.compareSync(passphrase, row.passphrase)) {
      var decrypted_text = cipher.decrypt(row.secret_text, passphrase, row.method)
      var decrypted_files = [];

      // //Read uploaded files
      // if (encrypted_files.files >= 1) { //Only decrypt if there are files to decrypt.
      //   encrypted_files.files.forEach(stored_file => {
      //     let file_name = stored_file.original_file_name;
      //     let encrypted_file_content = file.readSecret(stored_file.path); //Read file secret, from given filename
      //
      //     let file_content = cipher.decrypt(encrypted_file_content, passphrase, row.method); //Decrypt using file content
      //     if (!file_content) //Error if file decryption fails for some reason
      //       return next({status : 500, message: 'File decryption error.'});
      //
      //     decrypted_files.files.push({name : file_name, content : file_content});
      //   });
      // }

      //Read Encrypted files
        for (let i = 0, i_length = file_metadata.length; i < i_length; ++i) {
          let file_data = file_metadata[i];
          let file_name = cipher.decrypt(file_data.encrypted_file_name, passphrase, row.method); //Decrypt the file name, using the text method
          let decrypted_file_content = await file.readSecret(file_data.location);

          if (!decrypted_file_content.success) {
            throw error;
          }

          if (file_data.checksum != crypto.SHA256(decrypted_file_content).toString()) { //Ensure that the file matches saved checksum. If not, fail out
            throw {message: "File checksum mismatch!"};
          }

          decrypted_files.push({ //Push file data into object, and add to array
            name : file_name,
            encoding: file_data.encoding,
            file: decrypted_file_content,
            extension: file_data.extension,
            mimetype: file_data.mimetype,
            size : file_data.size,
            checksum : file_data.checksum
          });


        };


      file.deleteSecret(id);
      db.deleteSecret(id)
      return res.status(200).send({text: decrypted_text, files: decrypted_files})
      // return res.status(200).send({text: decrypted_text, files : decrypted_files})
    } else {
      db.updateUnauthorizedAttempts(row.id, secretHelper.incrementUnauthorizedAttempt(row, remoteIp))
      return next({status: 401, message: 'Unauthorized.'})
    }
  } catch (err) {
    return next({status: 500, error: err.message})
  }
}
