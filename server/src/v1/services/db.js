import sqlite3 from 'sqlite3'

const db_name = 'essw-v1.db' // process.env.DATABASE

function connect() {
  return new sqlite3.Database(db_name)
}

const db = connect()

export function initialise(overwrite=false) {
  db.serialize(() => {
    db.run(`BEGIN EXCLUSIVE TRANSACTION`)
    if (overwrite) {
      db.run(`DROP TABLE Secrets`)
    }
    db.run(`CREATE TABLE if not exists Secrets (
      id TEXT PRIMARY KEY NOT NULL,
      store TEXT NOT NULL,
      encrypted_passphrase TEXT NOT NULL,
      method INTEGER NOT NULL,
      expiration DATETIME,
      failed_attempts INTEGER NOT NULL DEFAULT 0,
      locked_at DATETIME,
      created_at DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime'))
    )`, (err) => {
      if (err) {
        console.error('SQL Table creation error: ' + err)
        return db.run(`ROLLBACK`)
      }
    })

    db.run(`COMMIT`)
  })
}

function close() {
  if (db)
    db.close()
}

function test() {

}

export function secretCreate(id, store, encrypted_passphrase, method, expiration) {
  var result = false
    console.log('11111')
  db.serialize(() => {
    console.log('22222')
    db.run(`BEGIN TRANSACTION`)
      console.log('3333')
    if (db.run(`INSERT INTO Secrets (id, store, encrypted_passphrase, method, expiration) VALUES ($id, $store, $encrypted_passphrase, $method, $expiration)`, {
      $id: id,
      $store: store,
      $encrypted_passphrase: encrypted_passphrase,
      $method: method,
      $expiration: expiration
    }, (err) => {
      if (err)
        console.error('Insertion error: ' + err)
    })) {
      console.log('comm')
      db.run(`COMMIT`)
      result = true
    } else {
      console.log('roll')
      db.run(`ROLLBACK`)
      result = false
    }
  })
  return result
}

export async function secretGet(id) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM Secrets WHERE id = ?`, [id], (err, row) => {
      if (err)
        reject(err)
      else
        resolve(row)
    })
  })
}

export async function secretDestroy(id) {
  db.run(`BEGIN TRANSACTION`)
  if (db.run(`DELETE FROM Secrets WHERE id = ?`, [id], (err) => {
    if (err)
      console.error('Deletion error: ' + err)
  })) {
    db.run(`COMMIT`)
    return true;
  } else {
    db.run(`ROLLBACK`)
    return false
  }
}
