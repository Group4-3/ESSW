import express from 'express'
import bcrypt from 'bcrypt'
import * as db from './services/db.js'
import * as textUtils from './helpers/text.js'
import * as cipher from './helpers/cipher.js'
import { pwnedPassphrase } from './helpers/pwned.js'

var router = express.Router()

/**
 * @swagger
 * /v1/secret/submit:
 *  post:
 *    tags:
 *      - Secrets
 *    description: Submits a new secret
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: body
 *        description: The secret text body
 *        in: body
 *        required: true
 *        type: string
 *      - name: passphrase
 *        description: The secret key to encrypt and protect the secret
 *        in: body
 *        required: true
 *        type: string
 *      - name: method
 *        description: The encryption method to use
 *        in: body
 *        required: false
 *        type: string
 *      - name: expiry
 *        description: The duration in seconds until the secret automatically expires
 *        in: body
 *        type: integer
 *        minimum: "1"
 *        maximum: '20'
 *    responses:
 *      '200':
 *        description: An ID of the new secret
 *        content:
 *          application/json:
 *            schema:
 *            type: object
 *            properties:
 *              id:
 *                type: integer
 *                description: The secret ID
 *      400:
 *        description: Param error
 */
router.post('/submit', async (req, res) => {
  const METHODS = {
    'aes': 0,
    'des': 1,
    'tripledes': 2,
    'rabbit': 3,
    'rc4': 4,
    'rc4drop': 5
  }
  const DEFAULT_METHOD = 'aes'
  const DEFAULT_EXPIRY = 86400 // 1 day
  const MAX_EXPIRY = 604800 // 7 days

  try {
    if (!req.body.body) throw 'Missing required body param: `body`.'
    var body = textUtils.escape(req.body.body.toString())

    if (!req.body.passphrase) throw 'Missing required body param: `passphrase`.'
    var passphrase = req.body.passphrase.toString()

    if (req.body.method && !METHODS.hasOwnProperty(req.body.method)) throw 'Param `method` must be one of: ' + Object.keys(METHODS).join(', ')
    var method = req.body.method ? req.body.method : DEFAULT_METHOD

    if (req.body.expiry && !Number.isInteger(parseInt(req.body.expiry)) || parseInt(req.body.expiry) < 0 || parseInt(req.body.expiry) > MAX_EXPIRY) throw 'Param `expiry` must be an integer between 0 and ' + MAX_EXPIRY
    var expiryOffset = req.body.expiry ? parseInt(req.body.expiry) : DEFAULT_EXPIRY

    var pwned = await pwnedPassphrase(passphrase)
    if (pwned) throw 'Passphrase has been pwned (leaked online); please use something else.'

    var expiryDate = new Date(Date.now() + expiryOffset*1000).toISOString()

    var id = cipher.generateIdentifier()
    //var encrypted_body = cipher.encrypt(body, passphrase, method)
    var encrypted_body = cipher.encryptAesDemo(body, passphrase)
    var hashed_passphrase = await bcrypt.hash(passphrase, 10).then(result => {
      return result
    })
    console.log(id)
    if (db.secretCreate(id, encrypted_body, hashed_passphrase, method, expiryDate)) {
      res.status(200).send({id: id})
    } else {
      res.status(400).send({error: "sql insertation error"})
    }
  } catch (err) {
    res.status(400).send({error: err})
  }
})

/**
 * @swagger
 * /v1/secret/{id}:
 *  post:
 *    tags:
 *      - Secrets
 *    description: Get secret
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: id
 *        description: The secret ID
 *        in: path
 *        required: true
 *      - name: passphrase
 *        description: The secret key to decrypt the secret
 *        in: body
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: The decrypted secret body
 *        schema:
 *      400:
 *        description: Param error
 */
router.post('/:id', async (req, res) => {
  try {
    if (!req.body.passphrase) throw 'Missing required body param: `passphrase`.'
    var passphrase = req.body.passphrase.toString()

    var row = await db.secretGet(req.params.id)
    if (!row) throw 'Secret with that Id does not exist or has been deleted.'

    bcrypt.compare(passphrase, row.encrypted_passphrase, (err, result) => {
      if (result) {
        var body = cipher.decryptAesDemo(row.store, passphrase)
        res.status(200).send({body: body})

        db.secretDestroy(row.id)
      } else {
        res.status(400).send({error: 'Incorrect passphrase.'})
      }
    })
  } catch (err) {
    res.status(400).send({error: err})
  }
})

router.delete('/:id', (req, res) => {
  res.status(501).send({})
})

export { router }
