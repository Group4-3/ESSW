/*
    ----- GROUP 43 Header -----
    Component Name: API Version 2 Index
    Description: Routing for API v2
    Date of Creation: 06/06/2022
    Author(s): Mitchell Sundstrom
*/

import express from 'express'
import { portrait } from '../helpers/text.js'
import { router as secret } from './secret/index.js'
import { router as passphrase } from './passphrase/index.js'
import { router as misc } from './misc/index.js'

var router = express.Router()

router.use('/secret', secret)
router.use('/passphrase', passphrase)
router.use('/', misc)

router.get('/', (req, res) => {
  res.status(200).json({
    '_': portrait()
  })
})

export { router }
