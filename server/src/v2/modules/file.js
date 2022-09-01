/*
    ----- GROUP 43 Header -----
    Component Name: group43_filestorage
    Description: Driver to interface with the filesystem
    Date of Creation: 31/08/2022
    Author(s): Kevin Lew

*/

import fs from 'fs';
import createHash from 'crypto-js';

const SECRET_STORAGE_DIRECTORY = '.';

async function generateChecksum(content, algorithm = 'sha256') { //Returns a checksum of the content, using the supplied algorithm (defaults to sha256)
    // return createHash.update(content).digest("hex") 
    return createHash(algorithm)
        .update(content)
        .digest('base64'); //Return base64 filename, for compactness
}

export function writeSecret(secret_id, secret_content) {
    var secret_hash = generateChecksum(secret_content);//, 'sha256'); //Use default sha256
    var secret_path = `${SECRET_STORAGE_DIRECTORY}/${secret_id}/${secret_hash}`;
    try {
        fs.writeFile(secret_path, secret_content);
    }
    catch (err) {
        return next({ success: false, error: err, error_messsage: `Unable to write file '${secret_path}': ${err}.` });
    }
    finally {
        return next({ success: true , path: secret_path, name: secret_hash});
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