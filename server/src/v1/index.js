import express from 'express'
import * as db from './services/db.js'
import { import_test } from './helpers/text.js'
import { router as secret } from './secret.js'
import { router as passphrase } from './passphrase.js'
import { router as test } from './crypto_test.js'

var router = express.Router()

db.initialise()

router.use('/secret', secret)
router.use('/passphrase', passphrase)
router.use('/test', test)

router.get('/', (req, res) => {
  res.status(200).send({
    '_': import_test()
  })
})

export {
  router
}
