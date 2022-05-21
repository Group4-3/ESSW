//https://www.freecodecamp.org/news/javascript-modules-explained-with-examples/ Module Behaviour


//Contain everything inside database namespace
var db = new function () { //https://stackoverflow.com/questions/881515/how-do-i-declare-a-namespace-in-javascript
    //https://stackoverflow.com/questions/4125479/what-s-the-difference-between-using-objects-and-functions-for-namespacing-in-jav

    //Sqlite File
    const sqlite3 = require('sqlite3');//.verbose(); //Create global variable for SQLite


//--- Core Database Functions ---
    var connectDatabase = function (databaseFileName) { //Open and connect to the database, if it does not exist  
        var db = new sqlite3.Database(databaseFileName);
        return db; //Return database object. Don't forget to close!
    };

    var closeDatabase = function (db){ //Close the database
        if (db) { //Only run if the database is open
            db.close();
        }
    };

    //--- Table Creation Functions ---

    var createSecretTables = function (db, deleteOriginal) { //Create the secret tables for the database. DOES NOT CREATE SHARD DATABASE
        function checkTableExists(db, table) {
            //check whether the table exists 
            db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`, table, (err, row) => {
                if (err) {
                    console.error("SQL table Check error: " + err);
                    return;
                }

                if (row) {
                    // console.log(row + "TRUE")
                    return true;
                }
                else {
                    // console.log(row + "FALSE")
                    return false;
                }
            }); //Return PRAGMA for table, and check the number of entries returned to get table name (https://stackoverflow.com/questions/59514987/how-to-check-if-a-table-exists-in-sqlite3-nodejs) https://www.sqlite.org/pragma.html#pragma_table_info
        }

        if (!checkTableExists(db, "Secrets")) { //Create table only if it does not exist
            db.serialize(() => {
                if (deleteOriginal)
                    db.run(`DROP TABLE 'Secrets'`);

                var TransactionSuccess = true;
                db.run(`BEGIN EXCLUSIVE TRANSACTION`); //Begin transaction and lockout database when creating table.
                db.run(`CREATE TABLE IF NOT EXISTS 'Secrets'(
                secret_id TEXT PRIMARY KEY NOT NULL,
                passphrase TEXT NOT NULL,
                passphrase_salt TEXT NOT NULL,
                ExpiryDate DATE)`, (err) => {
                    if (err) {
                        console.error("SQL Table creation error: " + err);
                        TransactionSuccess = false;
                        return;
                    }
                }); //Run create statement (Remove Viewed Boolean? The secret can just be deleted when viewed)
                if (TransactionSuccess) { //Commit transaction only if successful, or else, perform a rollback
                    db.run(`COMMIT`);
                }
                else {
                    db.run(`ROLLBACK`);
                }
            });
        }
        // return tableExists;
    };

    // --- Secret Storage Functions

    this.getSecret = function (db, table, secret_id) { //Fetch data from row. Should return an object(?) [Needs checking]
        var rowData = db.get(`SELECT * FROM ? WHERE secret_id = ?`, [table, secret_id], (err) => {
            if (err) {
                console.error("SQL Query error: " + err);
                return;
            };
        });

        //Remove secret when viewed
        if (rowData) {
            removeSecret(db, table, secret_id);
        };
    };

    var removeSecret = function (db, table, secret_id) {
        db.run(`BEGIN TRANSACTION`)
        if (db.run(`DELETE FROM ? WHERE secret_id = ?`, [table, secret_id])) {
            db.run(`COMMIT`)
            return true;
        }
        else {
            db.run(`ROLLBACK`)
            return false;
        }
    };

    this.addSecret = function (db, table, secret_id, passphrase, passphrase_salt, expiry) {//TODO: Add Secret (Maybe pass JSON object instead of variable?)
        db.serialize(() => {
            db.run(`BEGIN TRANSACTION`)
            if (db.run(`INSERT INTO $table VALUES ($id, $passphrase, $salt, $expiry)`, {
                $table:table,
                $id:secret_id,
                $passphrase:passphrase, 
                $salt:passphrase_salt,
                $expiry:expiry
            }, (err) => {
                console.error("Insertion error: " + err)
            })) {
                db.run(`COMMIT`);
            }
            else {
                db.run(`ROLLBACK`);
            }
        });
    };

    //--- Main Page Functions ---
    this.testDB = function () {
        var databaseFileName = "secrets.db"; //Database filename
        const _DELETEORIGINAL = FALSE;
        db = connectDatabase(databaseFileName); //Create Database Object
        createSecretTables(db, _DELETEORIGINAL);

        closeDatabase(db); //Close Database when finished
    };

    this.initialiseDB = function(databaseFileName, deleteOriginal) {
        // var databaseFilenName = "secrets.db";
        // const _DELETEORIGINAL = FALSE;
        db = connectDatabase(databaseFileName); //Create Database Object
        createSecretTables(db, deleteOriginal);
        return db;
    }

}
db.testDB();

export function initialiseDB () {
    const databaseFileName = "secrets.db";
    const _DELETEORIGINAL = FALSE;
    db.initialiseDB(databaseFileName, _DELETEORIGINAL);
}