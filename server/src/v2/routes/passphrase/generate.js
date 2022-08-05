/*
    ----- GROUP 43 Header -----
    Component Name: Passphrase/Generate
    Description: Generate a random password string from given parameters
    Date of Creation: 02/06/2022
    Author(s): Mitchell Sundstrom
*/

export function generate(req, res, next) {
  const MIN_LENGTH = 1
  const MAX_LENGTH = 256
  const DEFAULT_LENGTH = 32
  const DEFAULT_CHAR_SETS = "lowercase,uppercase,numerical,special"

  var length = req.body.length && parseInt(req.body.length) ? parseInt(req.body.length) : DEFAULT_LENGTH
  var selectedSets = req.body.character_set ? req.body.character_set.toString().toLowerCase().split(',') : DEFAULT_CHAR_SETS.split(',')

  var sets = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLOMNOPQRSTUVWXYZ',
    numerical: '1234567890',
    special:   '!@#$%^&*'
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

  const response = {
    passphrase: passphrase
  }

  return res.status(200).json(response)
}
