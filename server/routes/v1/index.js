var router = require('express').Router()

router.use('/secret', require('./secret'))
router.use('/passphrase', require('./passphrase'))

router.get('/', (req, res) => {
  res.send({'status': 200})
})

module.exports = router
