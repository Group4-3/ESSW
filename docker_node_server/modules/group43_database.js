/*
    ----- GROUP 4-3 Header -----
    Component Name: group43_database
    Date of Creation: 27/04/2022
    Description: Driver to interface with the SQLite database with functions required
    Author(s): Petri Bayley & Kevin Lew

*/

import Database from 'better-sqlite3';

const DROP_SECRET_TABLE_QUERY = `
DROP TABLE IF EXISTS 
secret;`;

/*
  Create Table Query
  Table name: secret
    id: The primary key id for each secret
    secret_text: The string of the secret
    passphrase: The string of the hashed password
    expiryDate: The date and time of when the secret should expire
    method: A code to indicate which method was used for encryption
    access_failed_attempts: The current number of failed attempts accesssing the secret
*/
const CREATE_TABLE_QUERY = `
CREATE TABLE
'secret'(
    id TEXT PRIMARY KEY NOT NULL,
    secret_text TEXT NOT NULL,
    passphrase TEXT NOT NULL,
    expiry_date DATE NOT NULL,
    method TEXT NOT NULL,
    access_failed_attempts INT NOT NULL DEFAULT 0
    );`;
const INSERT_SECRET_QUERY = `
INSERT INTO
secret
(
    id, 
    secret_text,
    passphrase, 
    expiry_date, 
    method
)
VALUES
(
    ?,
    ?,
    ?,
    ?,
    ?
);`;
const GET_SECRET_QUERY = `
SELECT 
secret_text 
FROM 
secret 
WHERE 
id = ? 
AND 
passphrase = ?
;
`
const PRUNE_SECRETS_QUERY = `
DELETE 
FROM 
secret 
WHERE 
expiry_date < CURRENT_TIMESTAMP
;
`

const DELETE_SECRET_QUERY = `
DELETE 
FROM 
secret 
WHERE 
id = ?
`

var databaseFile;

function initialise() {
  databaseFile = new Database("secrets.db");
  databaseFile.exec(DROP_SECRET_TABLE_QUERY);
  databaseFile.exec(CREATE_TABLE_QUERY);
}

initialise();

export function db_addSecret(secretObject) {
  try {
    databaseFile.exec(INSERT_SECRET_QUERY, secretObject.secret_id,secretObject.secret_text, secretObject.passphrase, secretObject.expiryDate, secretObject.method);
  }
  catch (err) {
    return { data: null, code: 500, human_code: `failure, ${err}` };
  }
  return { data: null, code: 200, human_readable_code: "Success" };
}

export function db_retrieveSecret(secretID, passphrase) {
  let row;
  try{
    let query = databaseFile.prepare(GET_SECRET_QUERY);
    row = query.get(secretID, passphrase);
  }
  catch (err) {
    return { data: null, code: 500, human_code: `failure, ${err}` };
  }
  return { data: row, code: 200, human_readable_code: "Success" };
}

export function db_deleteSecret(secretID) {
  try {
    databaseFile.exec(DELETE_SECRET_QUERY, secretID);
  }
  catch (err) {
    return { data: null, code: 500, human_code: `failure, ${err}` };
  }
  return { data: null, code: 200, human_readable_code: "Success" };
}

export function db_purgeExpiredSecrets() {
  try {
    databaseFile.exec(PRUNE_SECRETS_QUERY);
  }
  catch (err) {
    return { data: null, code: 500, human_code: `failure, ${err}` };
  }
  return { code: 200, human_readable_code: "Success" };
}