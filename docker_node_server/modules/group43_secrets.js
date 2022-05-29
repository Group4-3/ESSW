/*
    ----- GROUP 4-3 Header -----
    Component Name: group43_secrets
    Date of Creation: 29/05/2022
    Description: Load and generation of secrets
    Author(s): Petri Bayley 

*/

import fs, { rmSync } from 'fs';
import crypto from 'crypto';

export var pepper;

function initialise () {
    try {
        pepper = fs.readFileSync('/run/secret/node-pepper', 'utf-8');
    }
    catch(err) {
        console.log("Pepper secret doesn't exist, generating one");
        pepper = crypto.randomBytes(16).toString('hex');
    }
}

initialise();