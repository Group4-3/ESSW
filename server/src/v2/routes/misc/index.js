/*
    ----- GROUP 43 Header -----
    Component Name: Misc/Index
    Description: Index route for miscellaneous endpoints
    Date of Creation: 06/06/2022
    Author(s): Petri Bayley
*/
import express from 'express'

var router = express.Router()

router.get('/info_for_nerds', (req, res) => {
  res.status(418).json({
    def_res_url: req.url,
    def_res_code: 418,
    def_res_msg: "OK",
    version_major: 2, version_minor: 0, version_patch: 0
  })
})

export { router }
