var router = require('express').Router()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

const Crypto = require('crypto-js')
const db = require('../../services/db')

/**
 * @bodyParam {string} secret required The secret to encrypt.
 * @bodyParam {string} passphrase required The key to encrypt the secret.
 */
router.post('/encrypt', jsonParser, (req, res) => {
  console.log(req.body)
  var secret = req.body.secret.toString()
  var password = req.body.passphrase.toString()

  res.send({
    'status': 200,
    'transit': encryptAes(secret, password)
  })
})

/**
 * @bodyParam {string} encrypted_secret required The secret to encrypt.
 * @bodyParam {string} passphrase required The key to encrypt the secret.
 */
router.post('/decrypt', jsonParser, (req, res) => {
  var secret = req.body.encrypted_secret.toString()
  var password = req.body.passphrase.toString()

  res.send({
    'status': 200,
    'string': decryptAes(secret, password)
  })
})

/**
 * @bodyParam {string} secret required The secret to encrypt.
 * @bodyParam {string} passphrase required The key to encrypt the secret.
 */
router.post('/secret/submit', jsonParser, (req, res) => {
  var errs = []

  var params = {
    secret: req.body.secret.toString(),
    passphrase: req.body.passphrase.toString()
  }

  var id = Crypto.lib.WordArray.random(128/8).toString()
  var hashed_password = Crypto.SHA256(params.passphrase).toString() // TODO: salt
  var encrypted = encryptAes(params.secret, params.passphrase)

  db.run(`INSERT INTO SECRETS(id, store, encrypted_passphrase) VALUES(?, ?, ?)`, [id, encrypted, hashed_password], (err) => {
    if (err) {
      return console.log(err)
    }
  })

  res.send({
    'status': 200,
    'id': id
  })
})

const keySize = 256
const ivSize = 128
const iterations = 100

function encryptAes(body, pass) {
  var salt = Crypto.lib.WordArray.random(128/8)
  var iv = Crypto.lib.WordArray.random(ivSize/8)
  var key = Crypto.PBKDF2(pass, salt, {
    keySize: keySize/32,
    iterations: iterations
  })

  var encrypted = Crypto.AES.encrypt(body, key, {
    iv: iv,
    padding: Crypto.pad.Pkcs7,
    mode: Crypto.mode.CBC,
    hasher: Crypto.algo.SHA256
  })

  return salt.toString() + iv.toString() + encrypted.toString()
}

function decryptAes(body, pass) {
  var salt = Crypto.enc.Hex.parse(body.substr(0, 32))
  var iv = Crypto.enc.Hex.parse(body.substr(32, 32))
  var encrypted = body.substring(64)

  var key = Crypto.PBKDF2(pass, salt, {
    keySize: keySize/32,
    iterations: iterations
  })

  var decrypted = Crypto.AES.decrypt(encrypted, key, {
    iv: iv,
    padding: Crypto.pad.Pkcs7,
    mode: Crypto.mode.CBC,
    hasher: Crypto.algo.SHA256
  })

  return decrypted.toString(Crypto.enc.Utf8)
}

module.exports = router
