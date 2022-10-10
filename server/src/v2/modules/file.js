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
const FILE_COUNT_LIMIT = process.env.FILE_COUNT_LIMIT ? process.env.FILE_COUNT_LIMIT : 2

export const fileAttacher = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: process.env.MAXIMUM_SIZE_LIMIT ? process.env.MAXIMUM_SIZE_LIMIT : 2097152
  }
}).array('files', FILE_COUNT_LIMIT)

function initialiseSecretStorage() {
  // clean out stale secrets (if any) and create a fresh storage directory
  if (fs.existsSync(SECRET_STORAGE_DIRECTORY))
    fs.rmdirSync(SECRET_STORAGE_DIRECTORY, { recursive: true })

  fs.mkdirSync(SECRET_STORAGE_DIRECTORY)
}
initialiseSecretStorage()

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
    var secretDirectory = [SECRET_STORAGE_DIRECTORY, id].join('/')

    if (!fs.existsSync(secretDirectory))
      return { success: false, error: 'Directory does not exist' }

    var fileCount = fs.readdirSync(secretDirectory).length
    fs.rmdirSync(secretDirectory, { recursive: true })

    return { success: true, deleted_file_count: fileCount }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

// copied from client/src/helpers/file.js, and converted to function
export function humanReadableSize(bytes) {
  var size = parseInt(bytes)
  for (var unit of ['B', 'KB', 'MB', 'GB']) {
    if (size < 1024) return `${size.toFixed(1)} ${unit}`
    size /= 1024.0
  }

  return size
}

// https://stackoverflow.com/questions/6974614/how-to-convert-human-readable-memory-size-into-bytes
export function humanUnreadableSize(text) {
  var powers = { 'k': 1, 'm': 2, 'g': 3, 't': 4 }
  var regex = /(\d+(?:\.\d+)?)\s?(k|m|g|t)/i

  var res = regex.exec(text)

  return res[1] * Math.pow(1024, powers[res[2].toLowerCase()]) // assuming bytes as 1024, not 1000
}
