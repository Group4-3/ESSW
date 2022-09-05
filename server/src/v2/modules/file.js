/*
    ----- GROUP 43 Header -----
    Component Name: group43_filestorage
    Description: Driver to interface with the filesystem
    Date of Creation: 31/08/2022
    Author(s): Kevin Lew

*/

import fs from 'fs';
import createHash from 'crypto-js';

const SECRET_STORAGE_DIRECTORY = './secret_storage';


async function createDirectory(directory) { //Safely create directory, by only creating directory if it exists
    if (!fs.existsSync(directory)) {
        fs.mkdir(directory, (err) => {
            if (err.code != 'EEXIST') {
                throw err; //Throw error if we have any IO issues.
            }
        });
        return true; //Directory was created
    }
    return false; //Directory was not created
}

async function generateChecksum(content, algorithm = 'sha256') { //Returns a checksum of the content, using the supplied algorithm (defaults to sha256)
    // return createHash.update(content).digest("hex") 
    return createHash(algorithm)
        .update(content)
        .digest('base64'); //Return base64 filename, for compactness
}

export async function writeSecret(secret_id, secret_content) {
    var secret_hash = generateChecksum(secret_content);//, 'sha256'); //Use default sha256
    var secret_directory = `${SECRET_STORAGE_DIRECTORY}/${secret_id}`
    var secret_path = `${secret_directory}/${secret_hash}`;
    try {
        createDirectory(secret_directory)
        fs.writeFile(secret_path, secret_content);
    }
    catch (err) {
        return { success: false, error: err, error_messsage: `Unable to write file '${secret_path}': ${err}.` };
    }
    finally {
        return { success: true , path: secret_path, name: secret_hash};
    }
}

export async function readSecret(secret_path) {
    if (fs.readdir(secret_path).isDirectory()) { //Make sure that it's not a directory. May happen if secret path was malformed, and no ID was given. It is not possible to read a directory as a file.
        return next({success: false, error: `Secret Path ${secret_path} is directory!`}); //Stop if we're working from a directory.
    }
    var fileContent;
    try {
        fileContent = fs.readFile(secret_path);
    }
    catch (err) {
        return {success : false, error: err, error_message};
    }
    finally {
        return {success:true, file_content : fileContent};
    }
}
