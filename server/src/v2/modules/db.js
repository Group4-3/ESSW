/*
    ----- GROUP 43 Header -----
    Component Name: group43_database
    Description: Driver to interface with the SQLite database with functions required
    Date of Creation: 27/04/2022
    Author(s): Petri Bayley, Kevin Lew

*/

import Database from 'better-sqlite3';

const DROP_SECRET_TABLE_QUERY = `
DROP TABLE IF EXISTS
secret;
`;

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
    )
;
`;
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
)
;
`;
const GET_SECRET_QUERY = `
SELECT
*
FROM
secret
WHERE
id = ?
;
`;
const GET_PASSPHRASE_QUERY = `
SELECT
passphrase
FROM
secret
WHERE
id = ?
;
`
const PRUNE_SECRETS_QUERY = `
DELETE
FROM
secret
WHERE
expiry_date < CURRENT_TIMESTAMP
;
`;
const DELETE_SECRET_QUERY = `
DELETE
FROM
secret
WHERE
id = ?
;
`;

const INCREMENT_SECRET_FAILED_ACCESS_QUERY = `
UPDATE
secret
SET
access_failed_attempts = access_failed_attempts + 1
WHERE
id = ?
;
`

/*
  Global variable for the database file
*/
var databaseFile;

function initialise() {
  //databaseFile = new Database("secrets.db");
  databaseFile = new Database("secrets.db", { verbose: console.log });
  databaseFile.exec(DROP_SECRET_TABLE_QUERY);
  databaseFile.exec(CREATE_TABLE_QUERY);
  console.log("Started Database");
}

initialise();

function getStatement(preparedStatement, statementParams) {
  //Returns data
  let row;
  try {
    row = databaseFile.prepare(preparedStatement).get(statementParams);
  }
  catch (err) {
    return { data: null, code: 500, human_code: `failure, ${err}` };
  }
  return { data: row, code: 200, human_readable_code: "Success" };
}

function runStatement(preparedStatement, statementParams) {
  //Does not return data
  try {
    databaseFile.prepare(preparedStatement).run(statementParams);
  }
  catch (err) {
    return { data: null, code: 500, human_code: `failure, ${err}` };
  }
  return { data: null, code: 200, human_readable_code: "Success" };
}

export function addSecret(secretObject) {
  return runStatement(INSERT_SECRET_QUERY, secretObject.secret_id, secretObject.secret_text, secretObject.passphrase, secretObject.expiry_date, secretObject.method);
}


export function retrieveSecret(secretID) {
  return getStatement(GET_SECRET_QUERY, secretID);
}

export function retrievePassphrase(secretID) {
  return getStatement(GET_PASSPHRASE_QUERY, secretID);
}

export function deleteSecret(secretID) {
  return runStatement(DELETE_SECRET_QUERY, secretID);
}

export function incrementSecretFailedAccess(secretID) {
  return  runStatement(INCREMENT_SECRET_FAILED_ACCESS_QUERY, secretID);
}

export function purgeExpiredSecrets() {
  try {
    databaseFile.exec(PRUNE_SECRETS_QUERY);
  }
  catch (err) {
    return { data: null, code: 500, human_code: `failure, ${err}` };
  }
  return { code: 200, human_readable_code: "Success" };
}
