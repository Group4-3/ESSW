/*
    ----- GROUP 43 Header -----
    Component Name: group43_filestorage
    Description: Driver to interface with the filesystem
    Date of Creation: 31/08/2022
    Author(s): Kevin Lew
*/

import fs from 'fs'
import multer from 'multer'
import * as path from 'path'
import * as cipher from '../helpers/cipher.js'
import { stripTrailingSlash } from '../helpers/text.js'

const SECRET_STORAGE_DIRECTORY = stripTrailingSlash(process.env.FILE_STORAGE_PATH ? process.env.FILE_STORAGE_PATH : './uploads')
const FILE_COUNT_LIMIT = process.env.FILE_COUNT_LIMIT ? process.env.FILE_COUNT_LIMIT : 4; //Default to 4 files

export const fileAttacher = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2097152
  }
}).array('files', FILE_COUNT_LIMIT)

function initialiseSecretStorage() { //Initialise, and ensure that the secret storage directory is valid
  if (!fs.existsSync(SECRET_STORAGE_DIRECTORY)) { //Create directory if the secret storage directory doesn't exist
    console.warn('Secret storage directory %s does not exist, creating.', SECRET_STORAGE_DIRECTORY);
    fs.mkdirSync(SECRET_STORAGE_DIRECTORY);
  }
}

initialiseSecretStorage();

export async function writeSecretFile(buffer, passphrase, method, parentId = undefined, fileId = cipher.generateIdentifier()) {
  try {
    var content = buffer.toString()
    var checksum = cipher.generateChecksum(content)
    var encryptedFileContent = cipher.encrypt(content, passphrase, method)

    var saveDirectory = parentId !== undefined ? [SECRET_STORAGE_DIRECTORY, parentId].join('/') : SECRET_STORAGE_DIRECTORY
    var fileName = fileId;
    var filePath = [saveDirectory, fileName].join('/')

    if (!fs.existsSync(saveDirectory)) {
      fs.mkdirSync(saveDirectory);
    }

    fs.writeFileSync(filePath, encryptedFileContent)

    return { success: true, path: filePath, checksum: checksum }
  } catch (err) {
    console.log(err)
    return { success: false, error: err.message }
  }
}

export async function readSecretFile(filePath, passphrase, method) {
  try {
    // if (fs.readdir(filePath).isDirectory()) {
    //   return { success: false, error: `Secret path ${filePath} is a directory not a file` }
    // }

    var encryptedBuffer = fs.readFileSync(filePath)
    var encryptedContent = encryptedBuffer.toString()
    // we can assume that passphrase is correct as validation should have already occurred
    var decryptedFileContent = cipher.decrypt(encryptedContent, passphrase, method)
    var buffer = Buffer.from(decryptedFileContent)

    return { success: true, content: buffer }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function deleteSecretFileDirectory(id) {
  try {
    let secretDirectory = [SECRET_STORAGE_DIRECTORY, id].join('/')
    if (!fs.existsSync(secretDirectory)) {
      return { success: false, error: 'Directory does not exist' }
    }

    fileCount = fs.readdirSync(secretDirectory).length
    fs.rmdirSync(secret_path, { recursive: true })

    return { success: true, deleted_file_count: fileCount }
  } catch (err) {
    return { success: false, error: err.message }
  }
}
