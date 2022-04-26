//Sqlite File
const sqlite3 = require('sqlite3').verbose(); //Create global variable for SQLite

function connectDatabase() { //Open and connect to the database, if it does not exist  
    var databaseFileName = "secrets";
    var db = new sqlite3.Database(databaseFileName);
    return db;
}

function closeDatabase(db){ //Close the database
    if (db) {
        db.close();
    }
}

function checkTableExists(db, table) {
    //check whether the table exists 
    db.serialize(() => {
        db.get //Return PRAGMA for table, and check the number of entries returned to get table name (https://stackoverflow.com/questions/59514987/how-to-check-if-a-table-exists-in-sqlite3-nodejs) https://www.sqlite.org/pragma.html#pragma_table_info
    })
}

function createSecretTables(db) { //Create the secret tables for the database. DOES NOT CREATE SHARD DATABASE
    // var tableExists = false; //Just use the checkTableExists function

    db.serialize(() => {
        db.prepare(`CREATE TABLE IF NOT EXISTS 'Secrets'(
        secret_id TEXT PRIMARY KEY NOT NULL,
        passphrase TEXT NOT NULL,
        ExpiryDate DATE,
        Viewed BOOLEAN NOT NULL)`) //insert create statements for table here
    })
}

//TODO: Write function to perform actual database operations and call the above functions to do it with 