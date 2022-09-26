/*
    ----- GROUP 43 Header -----
    Component Name: group43_filestorage
    Description: Driver to interface with the filesystem
    Date of Creation: 31/08/2022
    Author(s): Kevin Lew
*/

import fs from 'fs'
import multer from 'multer'
import crypto from 'crypto-js'
import * as path from 'path'
import * as cipher from '../helpers/cipher.js'

const SECRET_STORAGE_DIRECTORY = './uploads'

export const fileAttacher = multer({
  storage: multer.memoryStorage()
}).array('files', 1)

export function generateChecksum(content) {
  return crypto.SHA256(content).toString()
}

export async function writeSecretFile(buffer, passphrase, method, id = undefined) {
  try {
    var content = buffer.toString()
    var checksum = generateChecksum(content)
    var encryptedFileContents = cipher.encrypt(content, passphrase, method)

    var saveDirectory = id !== undefined ? [SECRET_STORAGE_DIRECTORY, id].join('/') : SECRET_STORAGE_DIRECTORY
    var fileName = [checksum, cipher.generateIdentifier()].join('_')
    var filePath = [saveDirectory, fileName].join('/')

    if (!fs.existsSync(saveDirectory)) {
      await fs.mkdirSync(saveDirectory)
    }

    await fs.writeFile(filePath, encryptedFileContents, (err) => {
      if (err) {
        // return { success: false, error: err.message }
        throw err.message; //Error will be caught by catch statement below
      }
    })

    return { success: true, path: filePath, checksum: checksum }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function readSecret(secret_path, passphrase, method) {
    if (fs.readdir(secret_path).isDirectory()) { //Make sure that it's not a directory. May happen if secret path was malformed, and no ID was given. It is not possible to read a directory as a file.
        return {success: false, error: `Secret Path ${secret_path} is directory!`}; //Stop if we're working from a directory.
    }
    var file;
    try {
      let encrypted_file_content = fs.readFile(secret_path);
      let decrypted_file_content = cipher.decrypt(encrypted_file_content, passphrase, method); //We can assume that passphrase is correct, as validation has already occurred
      file = Buffer.from(decrypted_file_content);
    }
    catch (err) {
        return {success : false, error: err}
    }
    finally {
        return {success:true, file_content : file}
    }
}
