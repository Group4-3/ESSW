/*
    ----- GROUP 43 Header -----
    Component Name: Secret/Destroy
    Description: Burn a secret from the system
    Date of Creation: 27/07/2022
    Author(s): Mitchell Sundstrom
*/

import bcrypt from 'bcrypt'
import * as db from '../../modules/db.js'
import * as ipHelper from '../../helpers/ip.js'
import * as secretHelper from '../../helpers/secret.js'

export async function secretDestroy(req, res, next) {
  try {
    var remoteIp = ipHelper.getRemoteIp(req)

    if (!req.params.id)
      return next({message: 'Missing required request param: `id`.'})
    var id = req.params.id

    if (!req.body.passphrase)
      return next({message: 'Missing required body param: `passphrase`.'})
    var passphrase = req.body.passphrase.toString()

    var row = await db.retrieveSecret(id)
    if (!row.data)
      return next({status: 404, message: 'Secret with that ID does not exist or has been deleted.'})
    row = row.data

    if (!secretHelper.canAttemptAccess(row, remoteIp))
      return next({status: 429, message: 'Too many unsuccessful access attempts; the requested secret is locked.'})

    if(bcrypt.compareSync(passphrase, row.passphrase)) {
      db.deleteSecret(id)
      return res.status(200).send()
    } else {
      db.updateUnauthorizedAttempts(row.id, secretHelper.incrementUnauthorizedAttempt(row, remoteIp))
      return next({status: 401, message: 'Unauthorized.'})
    }
  } catch (err) {
    return next({status: 500, error: err.message})
  }
}
