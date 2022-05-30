import express from 'express'
import { import_test } from './helpers/test.js'
import { router as getSecretRoute } from './get_secret.js'
import { router as submitSecretRoute } from './submit_secret.js'
import { router as infoRoute } from './info_for_nerds.js'

var router = express.Router()

router.use('/secret/get', getSecretRoute)
router.use('/secret/submit', submitSecretRoute)
router.use('/info_for_nerds', infoRoute)

router.get('/', (req, res) => {
  res.status(200).send({
    '_': import_test()
  })
})

export {
  router
}
