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

var TABLE_NAME = "Secret";
var databaseFile;

function initialise() {
  //databaseFile = new Database("secrets.db");
  databaseFile = new Database("secrets.db", { verbose: console.log });
  const dropStatement = databaseFile.prepare('DROP TABLE IF EXISTS ?');
  dropStatement.run(TABLE_NAME);
  console.log("Cleared Table ${TABLE_NAME} (if exists).")
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
'?'(
    id TEXT PRIMARY KEY NOT NULL,
    secret_text TEXT NOT NULL,
    passphrase TEXT NOT NULL,
    expiry_date DATE NOT NULL,
    method TEXT NOT NULL,
    access_failed_attempts INT NOT NULL DEFAULT 0
    )
`);
  createStatement.run(TABLE_NAME);
  console.log("Created New Table ${TABLE_NAME}.")
  console.log("Database initialised successfully.");
}

initialise();

function getStatement(preparedStatement, statementParams) {
  //Returns data
  let row;
  try {
    row = preparedStatement.get(statementParams);
  }
  catch (err) {
    return { data: null, code: 500, human_code: `failure, ${err}` };
  }
  return { data: row, code: 200, human_readable_code: "Success" };
}

function runStatement(preparedStatement, statementParams) {
  //Does not return data
  try {
    preparedStatement.run(statementParams);
  }
  catch (err) {
    return { data: null, code: 500, human_code: `failure, ${err}` };
  }
  return { data: null, code: 200, human_readable_code: "Success" };
}

//---

const INSERT_SECRET_QUERY = databaseFile.prepare(`
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
    @secret_id,
    @secret_text,
    @passphrase,
    @expiry_date,
    @method
)
`);

export function addSecret(secretObject) {
  return runStatement(INSERT_SECRET_QUERY, secretObject);
}

//---

const GET_SECRET_QUERY = databaseFile.prepare(`SELECT * FROM secret WHERE id = ?`);

export function retrieveSecret(secretID) {
  return getStatement(GET_SECRET_QUERY, secretID);
}

//---

const GET_PASSPHRASE_QUERY = databaseFile.prepare(`SELECT passphrase FROM secret WHERE id = ?`);

export function retrievePassphrase(secretID) {
  return getStatement(GET_PASSPHRASE_QUERY, secretID);
}

//---
const DELETE_SECRET_QUERY = databaseFile.prepare(`DELETE FROM secret WHERE id = ?`);

export function deleteSecret(secretID) {
  return runStatement(DELETE_SECRET_QUERY, secretID);
}

//---
const INCREMENT_SECRET_FAILED_ACCESS_QUERY = databaseFile.prepare(`
UPDATE
secret
SET
access_failed_attempts = access_failed_attempts + 1
WHERE
id = ?`);

export function incrementSecretFailedAccess(secretID) {
  return runStatement(INCREMENT_SECRET_FAILED_ACCESS_QUERY, secretID);
}

//---
const PRUNE_SECRETS_QUERY = databaseFile.prepare(`DELETE FROM secret WHERE expiry_date < CURRENT_TIMESTAMP`);

export function purgeExpiredSecrets() {
  return runStatement(PRUNE_SECRETS_QUERY);
}
