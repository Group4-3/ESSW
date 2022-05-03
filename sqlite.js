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

function createSecretTables(db) { //Create the secret tables for the database. DOES NOT CREATE SHARD DATABASE
    var tableExists = checkTableExists(db, "Secrets"); 

    if (!tableExists) { //Create table only if it does not exist
        db.run(`CREATE TABLE IF NOT EXISTS 'Secrets'(
        secret_id TEXT PRIMARY KEY NOT NULL,
        passphrase TEXT NOT NULL,
        ExpiryDate DATE,
        Viewed BOOLEAN NOT NULL)`); //Run create statement (Remove Viewed Boolean? The secret can just be deleted when viewed)
    }
    return tableExists;
}

// --- Secret Storage Functions

function getRow(db, table) { //Fetch data from row
    
}

//--- Main Page Functions ---
function main() {
    var databaseFileName = "secrets.db"; //Database filename
    db = connectDatabase(databaseFileName); //Create Database Object

    closeDatabase(db); //Close Database when finished
}