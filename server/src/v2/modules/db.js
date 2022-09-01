/*
    ----- GROUP 43 Header -----
    Component Name: group43_database
    Description: Driver to interface with the SQLite database with functions required
    Date of Creation: 27/04/2022
    Author(s): Petri Bayley, Kevin Lew

*/

import Database from 'better-sqlite3';

/*
Global variable for the database file
*/

const TABLE_NAME = "Secret";
const databasePath = "./secrets.db"
var databaseFile;

function initialiseSecret() {
  databaseFile = new Database("secrets.db", {
    verbose: (["development"].includes(process.env.NODE_ENV) ? console.log : null)
  });
  var initialisationFail = true;
  const recreateTable = databaseFile.transaction(() => { //Lock out all database functions when initialising, and put into transaction
    const dropStatement = databaseFile.prepare(`DROP TABLE IF EXISTS '${TABLE_NAME}'`);
    dropStatement.run()
    console.log(`Cleared Table ${TABLE_NAME} (if exists).`);
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
    const createStatement = databaseFile.prepare(`
CREATE TABLE
'${TABLE_NAME}'(
    id TEXT PRIMARY KEY NOT NULL,
    secret_text TEXT,
    secret_file_metadata TEXT,
    passphrase TEXT NOT NULL,
    expiry_date DATE NOT NULL,
    method TEXT NOT NULL,
    access_failed_attempts INT NOT NULL DEFAULT 0
    )
`);
    createStatement.run();
    console.log(`Created New Table ${TABLE_NAME}.`)
    initialisationFail = false;
  });
  recreateTable.exclusive();
  if (initialisationFail){
    console.error(`Could not initialise database! If you do not know why this error occurred, try deleting the database file, located at '${databasePath}' and trying again later.`);
  }
  else {
    console.log("Database initialised successfully.");
  }
}

initialiseSecret();

function getStatement(preparedStatement, statementParams) {
  //Returns data
  let row;
  try {
    row = preparedStatement.get(statementParams);
  }
  catch (err) {
    return { data: null, error: err, success: false };
  }
  return { data: row, success: true };
}

function runStatement(preparedStatement, statementParams) {
  //Does not return data
  try {
    preparedStatement.run(statementParams);
  }
  catch (err) {
    return { data: null, error: err, success: false };
  }
  return { data: {}, success: true };
}

//---

const INSERT_SECRET_QUERY = databaseFile.prepare(`
INSERT INTO
'${TABLE_NAME}'
(
    id,
    secret_text,
    secret_file_metadata,
    passphrase,
    expiry_date,
    method
)
VALUES
(
    @secret_id,
    @secret_text,
    @file_metadata
    @passphrase,
    @expiry_date,
    @method
)
`);

export function addSecret(secretObject) {
  return runStatement(INSERT_SECRET_QUERY, secretObject);
}

//---

const GET_SECRET_QUERY = databaseFile.prepare(`SELECT * FROM '${TABLE_NAME}' WHERE id = ?`);

export function retrieveSecret(secretID) {
  return getStatement(GET_SECRET_QUERY, secretID);
}

//---

const GET_PASSPHRASE_QUERY = databaseFile.prepare(`SELECT passphrase FROM '${TABLE_NAME}' WHERE id = ?`);

export function retrievePassphrase(secretID) {
  return getStatement(GET_PASSPHRASE_QUERY, secretID);
}

//---
const DELETE_SECRET_QUERY = databaseFile.prepare(`DELETE FROM '${TABLE_NAME}' WHERE id = ?`);

export function deleteSecret(secretID) {
  return runStatement(DELETE_SECRET_QUERY, secretID);
}

//---
const INCREMENT_SECRET_FAILED_ACCESS_QUERY = databaseFile.prepare(`
UPDATE
'${TABLE_NAME}'
SET
access_failed_attempts = access_failed_attempts + 1
WHERE
id = ?`);

export function incrementSecretFailedAccess(secretID) {
  return runStatement(INCREMENT_SECRET_FAILED_ACCESS_QUERY, secretID);
}

//---
const PRUNE_SECRETS_QUERY = databaseFile.prepare(`DELETE FROM '${TABLE_NAME}' WHERE expiry_date < CURRENT_TIMESTAMP`);

export function purgeExpiredSecrets() {
  try {
    var purgeInfo = PRUNE_SECRETS_QUERY.run();
  }
  catch (err) {
    return { data: null, error: err, success: false };
  }
  return { data: purgeInfo.changes, success: true }; //Return the number of rows affected by purge
}
