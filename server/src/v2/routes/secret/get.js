/*
    ----- GROUP 43 Header -----
    Component Name: Secret/Get
    Description: Retrieve a secret given an ID and valid passphrase
    Date of Creation: 02/06/2022
    Author(s): Petri Bayley, Mitchell Sundstrom
*/

import bcrypt from 'bcrypt'
import * as db from '../../modules/db.js'
import * as cipher from '../../helpers/cipher.js'
import * as textUtils from '../../helpers/text.js'

export async function secretGet(req, res, next) {
  try {
    if (!req.params.id)
      return next({message: 'Missing required request param: `id`.'})
    var id = req.params.id

    if (!req.body.passphrase)
      return next({message: 'Missing required body param: `passphrase`.'})
    var passphrase = req.body.passphrase.toString()

    var row = await db.retrieveSecret(id)
    if (!row.data)
      return next({message: 'Secret with that ID does not exist or has been deleted.'})
    row = row.data

    if(bcrypt.compareSync(passphrase, row.passphrase)) {
      var decrypted_body = cipher.decryptAesDemo(row.secret_text, passphrase)
      return res.status(200).send({body: decrypted_body})
    } else {
      return next({status: 401, message: 'Unauthorized.'})
    }
  } catch (err) {
    return next({status: 500, error: err})
  }
}
