var router = require('express').Router()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

const Crypto = require('crypto-js')
const db = require('../../services/db')

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
