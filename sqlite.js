//Sqlite File
const sqlite3 = require('sqlite3').verbose(); //Create global variable for SQLite


//--- Core Database Functions ---
function connectDatabase(databaseFileName) { //Open and connect to the database, if it does not exist  
    var db = new sqlite3.Database(databaseFileName);
    return db; //Return database object. Don't forget to close!
}

function closeDatabase(db){ //Close the database
    if (db) { //Only run if the database is open
        db.close();
    }
}

//--- Table Creation Functions ---

function createSecretTables(db) { //Create the secret tables for the database. DOES NOT CREATE SHARD DATABASE
    function checkTableExists(db, table) {
        //check whether the table exists 
        db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`, table, (err, row) => {
            if (err) {
                console.error("SQL table Check error: " + err);
                return;
            }

            if (row) {
                return true;
            }
            else {
                return false;
            }
        }); //Return PRAGMA for table, and check the number of entries returned to get table name (https://stackoverflow.com/questions/59514987/how-to-check-if-a-table-exists-in-sqlite3-nodejs) https://www.sqlite.org/pragma.html#pragma_table_info
    }

    var tableExists = checkTableExists(db, "Secrets"); 

    if (!tableExists) { //Create table only if it does not exist
        db.run(`CREATE TABLE IF NOT EXISTS 'Secrets'(
        secret_id TEXT PRIMARY KEY NOT NULL,
        passphrase TEXT NOT NULL,
        ExpiryDate DATE,
        Viewed BOOLEAN NOT NULL)`, (err) => {
            if (err) {
                console.error("SQL Table creation error: " + err);
                return;
            }
        }); //Run create statement (Remove Viewed Boolean? The secret can just be deleted when viewed)
    }
    return tableExists;
}

// --- Secret Storage Functions

function getSecret(db, table, secret_id) { //Fetch data from row. Should return an object(?) [Needs checking]
    return db.get(`SELECT * FROM ? WHERE secret_id = ?`, [table, secret_id], (err) => {
        if (err) {
            console.error("SQL Query error: " + err);
            return;
        }
    })
}

function removeSecret(db, table, secret_id) {
    if (db.run(`DELETE FROM ? WHERE secret_id = ?`, [table, secret_id])) {
        return true;
    }
    else {
        return false;
    }
}

//--- Main Page Functions ---
function main() {
    var databaseFileName = "secrets.db"; //Database filename
    db = connectDatabase(databaseFileName); //Create Database Object

    closeDatabase(db); //Close Database when finished
}