var router = require('express').Router()
var { import_test } = require('./utilities/test')
var db = require('../../services/db')

db.initialise()

router.use('/secret', require('./secret'))
router.use('/passphrase', require('./passphrase'))
router.use('/test', require('./crypto_test'))

router.get('/', (req, res) => {
  res.status(200).send({
    '_': import_test()
  })
})

module.exports = router
