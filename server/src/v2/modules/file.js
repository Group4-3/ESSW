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
        return { success: false, error: err.message }
      }
    })

    return { success: true, path: filePath, checksum: checksum }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export function readSecret(secret_path) {
    if (fs.readdir(secret_path).isDirectory()) { //Make sure that it's not a directory. May happen if secret path was malformed, and no ID was given. It is not possible to read a directory as a file.
        return next({success: false, error: `Secret Path ${secret_path} is directory!`}); //Stop if we're working from a directory.
    }
    var fileContent;
    try {
        fileContent = fs.readFile(secret_path);
    }
    catch (err) {
        return next({success : false, error: err, error_message})
    }
    finally {
        return next({success:true, file_content : fileContent})
    }
}
