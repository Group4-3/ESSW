/*
    ----- GROUP 4-3 Header -----
    Component Name: SQLite Driver
    Date of Creation: 27/04/2022
    Description: Driver to interface with the SQLite database with functions required
    Author(s): Petri Bayley & Kevin Lew

*/

let databaseFile = new sqlite3.Database("secrets.db", sqlite3.OPEN_READWRITE, (err) => {
    console.log(`Error while opening database file: ${err}`);
});

export function addSecret(secretObject) {//Takes JSON Object, and adds secret to database.
    return new Promise((resolve, reject) => {
        if(!databaseFile) {
            reject({ data: err, code: 500, human_code: "failure, database not open" });
        }
        databaseFile.run(`INSERT INTO secret (password, secret_object, passphrase)`);
    });
}

export function db_retrieveSecret(secretID, passphrase) {
    return new Promise((resolve, reject) => {
        if(!databaseFile) {
            reject({ data: err, code: 500, human_code: "failure, database not open" });
        }
        databaseFile.get(`SELECT secret_object FROM secrets WHERE secret_id = ?, passphrase = ?`, secretID, passphrase, (err, row) => {
            if(err)
                reject({ data: err, code: 500, human_code: "failure, database error" });
            else
                resolve({ data: row, code: 200, human_readable_code: "Success" });
        });
    });
}

export function db_purgeDatabase() {
    return new Promise((resolve, reject) => {
        if(!databaseFile) {
            reject({ data: err, code: 500, human_code: "failure, database not open" });
        }
        databaseFile.run(`DELETE FROM Secrets WHERE expiry < CURRENT_TIMESTAMP`, (err) => {
            if(err) {
                reject({ data: err, code: 500, human_code: "failure, database error" });
            }
            else {
                resolve({ code: 200, human_readable_code: "Success" });
            }
        });
    });
}