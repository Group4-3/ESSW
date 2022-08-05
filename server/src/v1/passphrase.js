import express from 'express'
import * as db from './services/db.js'
import { pwnedPassphrase } from './helpers/pwned.js'

var router = express.Router()

/**
 * @bodyParam {integer} length optional The length of the passphrase to generate.
 * @bodyParam {string} character_set optional A comma separated list of character sets to generate the passphrase with. Available options: lowercase uppercase numerical special.
 *
 * @returnParam {string} passphrase The generated passphrase.
 */
router.get('/', (req, res) => {
  const MIN_LENGTH = 1
  const MAX_LENGTH = 256
  const DEFAULT_LENGTH = 32
  const DEFAULT_CHAR_SETS = "lowercase,uppercase,numerical,special"

  try {
    // need better validations
    var length = req.body.length && parseInt(req.body.length) ? parseInt(req.body.length) : DEFAULT_LENGTH
    var selectedSets = req.body.character_set ? req.body.character_set.toString().toLowerCase().split(',') : DEFAULT_CHAR_SETS.split(',')

    var sets = {
      'lowercase': 'abcdefghijklmnopqrstuvwxyz',
      'uppercase': 'ABCDEFGHIJKLOMNOPQRSTUVWXYZ',
      'numerical': '1234567890',
      'special'  : '!@#$%^&*'
    }

    var characters = ""
    selectedSets.forEach((e) => {
      if (!sets.hasOwnProperty(e)) return
      characters += sets[e]
    })

    var passphrase = ""
    for (var i = 0; i < length; i++) {
      var num = Math.floor(Math.random() * characters.length)
      passphrase += characters.substring(num, num+1)
    }

    res.status(200).send({
      'passphrase': passphrase
    })
  } catch (err) {
    console.log(err)
  }
})

/**
 * @Param {string} passphrase required The passphrase to check.
 *
 * @returnParam {boolean} pwned True or false whether the passphrase has been exposed.
 */
router.get('/pwned/:passphrase', async (req, res) => {
  try {
    res.status(200).send({
      'pwned': await pwnedPassphrase(req.params.passphrase)
    })
  } catch (err) {
    console.log(err)
  }
})

export { router }
