const sqlite3 = require('sqlite3')
const db_name = 'essw.db' // process.env.DATABASE

const connect = () => {
  return new sqlite3.Database(db_name)
}

const db = connect()

const initialise = (overwrite=false) => {
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

const close = () => {
  if (db)
    db.close()
}

const test = () => {

}

const Secret = {
  create: (id, store, encrypted_passphrase, method, expiration) => {
    var result = false
    db.serialize(() => {
      console.info('BEGIN INSET INTO Secrets')
      console.log([id, store, encrypted_passphrase, method, expiration].join(" - "))

      db.run(`BEGIN TRANSACTION`)
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
        db.run(`COMMIT`)
        console.info('COMMIT')
        result = true
      } else {
        db.run(`ROLLBACK`)
        console.error('ROLLBACK')
        result = false
      }
    })
    return result
  },

  get: async (id) => {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM Secrets WHERE id = ?`, [id], (err, row) => {
        if (err)
          reject(err)
        else
          resolve(row)
      })
    })
  },

  destroy: (id) => {
    console.info('BEGIN DELETE FROM Secrets')
    console.log([id].join(" - "))

    db.run(`BEGIN TRANSACTION`)
    if (db.run(`DELETE FROM Secrets WHERE id = ?`, [id], (err) => {
      if (err)
        console.error('Deletion error: ' + err)
    })) {
      db.run(`COMMIT`)
      console.info('COMMIT')
      return true;
    } else {
      db.run(`ROLLBACK`)
      console.error('ROLLBACK')
      return false
    }
  }
}

module.exports = {
  initialise,
  Secret
}
