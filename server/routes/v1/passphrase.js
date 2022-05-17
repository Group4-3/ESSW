var router = require('express').Router()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

/**
 * @bodyParam {integer} length optional The length of the passphrase to generate.
 * @bodyParam {string} character_set optional A comma separated list of character sets to generate the passphrase with. Available options: lowercase uppercase numerical special
 */
router.get('/', jsonParser, (req, res) => {
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

module.exports = router
