/*
    ----- GROUP 43 Header -----
    Component Name: group43_database
    Description: Driver to interface with the SQLite database with functions required
    Date of Creation: 27/04/2022
    Author(s): Petri Bayley, Kevin Lew

*/

import Database from 'better-sqlite3';
import fs from 'fs';

/*
Global variable for the database file
*/

const TABLE_NAME = process.env.SECRET_TABLE_NAME ? process.env.SECRET_TABLE_NAME : "Secret"; //Only replace if the secret table does not exist.
const DATABASE_PATH = process.env.DATABASE_PATH ? process.env.DATABASE_PATH : "./secrets.db";
var databaseFile;

function initialiseSecret() {
  console.printlo
  if (fs.existsSync(DATABASE_PATH) && fs.lstatSync(DATABASE_PATH).isDirectory()){
    console.error("Database path '%s' is a directory, not a file. Halting.", DATABASE_PATH);
    throw "Database path is directory!";
  }

  databaseFile = new Database(DATABASE_PATH, {
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
    unauthorized_attempts TEXT NOT NULL
    )
`);
    createStatement.run();
    console.log(`Created New Table ${TABLE_NAME}.`)
    initialisationFail = false;
  });
  recreateTable.exclusive();
  if (initialisationFail){
    console.error(`Could not initialise database! If you do not know why this error occurred, try deleting the database file, located at '${DATABASE_PATH}' and trying again later.`);
  }
  else {
    console.log("Database initialised successfully.");
  }
}

initialiseSecret();

function getStatement(preparedStatement, statementParams = null) {
  //Returns data
  let row;
  try {
    row = preparedStatement.get(statementParams);
  }
  catch (err) {
    return { data: null, error: err.message, success: false };
  }
  return { data: row, success: true };
}

function runStatement(preparedStatement, statementParams) {
  //Does not return data
  try {
    preparedStatement.run(statementParams);
  }
  catch (err) {
    return { data: null, error: err.message, success: false };
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
    method,
    unauthorized_attempts
)
VALUES
(
    @secret_id,
    @secret_text,
    @file_metadata,
    @passphrase,
    @expiry_date,
    @method,
    @unauthorized_attempts
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
// const DELETE_SECRET_QUERY = databaseFile.prepare(`DELETE FROM '${TABLE_NAME}' WHERE id = ?`);
const DELETE_SECRET_QUERY = databaseFile.prepare(`UPDATE '${TABLE_NAME}' SET expiry_date = CURRENT_TIMESTAMP WHERE ID = ?`);

export function deleteSecret(secretID) {
  return runStatement(DELETE_SECRET_QUERY, secretID);
}

//---
const UPDATE_UNAUTHORIZED_ATTEMPTS_QUERY = databaseFile.prepare(`
UPDATE
'${TABLE_NAME}'
SET
unauthorized_attempts = ?
WHERE
id = ?`);

export function updateUnauthorizedAttempts(secretID, jsonStr) {
  return runStatement(UPDATE_UNAUTHORIZED_ATTEMPTS_QUERY, [jsonStr, secretID]);
}

//---
const SHOW_EXPIRED_SECRETS = databaseFile.prepare(`SELECT id FROM '${TABLE_NAME}' WHERE expiry_date < CURRENT_TIMESTAMP`);

export function showExpiredSecrets() {
  let secretIterator;
  try {
    secretIterator = SHOW_EXPIRED_SECRETS.iterate(); //Provide iterator containing list of secrets. Iterator used, in case of large numbers of secrets
  }
  catch (err) {
    return { data: null, error: err.message, success: false };
  }
  return { data: secretIterator, success: true };
}

const PRUNE_SECRETS_QUERY = databaseFile.prepare(`DELETE FROM '${TABLE_NAME}' WHERE expiry_date < CURRENT_TIMESTAMP`);

export function purgeExpiredSecrets() {
  try {
    var purgeInfo = PRUNE_SECRETS_QUERY.run();
  }
  catch (err) {
    return { data: null, error: err.message, success: false };
  }
  return { data: purgeInfo.changes, success: true }; //Return the number of rows affected by purge
}
