var router = require('express').Router()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var bcrypt = require('bcrypt')
var db = require('../../services/db')
var textUtils = require('./utilities/text')
var cipher = require('./utilities/cipher')
var { pwnedPassphrase } = require('./utilities/pwned')


router.post('/submit', jsonParser, (req, res) => {
  res.status(501).send({})
})

router.post('/:id', jsonParser, (req, res) => {
  res.status(501).send({})
})

router.delete('/:id', jsonParser, (req, res) => {
  res.status(501).send({})
})

module.exports = router
