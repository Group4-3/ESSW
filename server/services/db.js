// database connection
// temp measure - need to better integrate Kevin's API

const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('essw.db')

db.serialize(() => {
  db.run(`BEGIN EXCLUSIVE TRANSACTION`)
  db.run(`CREATE TABLE if not exists SECRETS (
    id TEXT PRIMARY KEY NOT NULL,
    store TEXT NOT NULL,
    encrypted_passphrase TEXT NOT NULL,
    method INTEGER NOT NULL,
    expiration DATE,
    failed_attempts INTEGER NOT NULL DEFAULT 0,
    locked_at DATE
  )`, (err) => {
    if (err) {
      console.error(err)
      return db.run(`ROLLBACK`)
    }
  })

  db.run(`COMMIT`)
})

module.exports = db
