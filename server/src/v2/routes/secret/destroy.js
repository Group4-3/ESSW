/*
    ----- GROUP 43 Header -----
    Component Name: Secret/Destroy
    Description: Burn a secret from the system
    Date of Creation: 27/07/2022
    Author(s): Mitchell Sundstrom
*/

import bcrypt from 'bcrypt'
import * as db from '../../modules/db.js'

export async function secretDestroy(req, res, next) {
  try {
    if (!req.params.id)
      return next({message: 'Missing required request param: `id`.'})
    var id = req.params.id

    if (!req.body.passphrase)
      return next({message: 'Missing required body param: `passphrase`.'})
    var passphrase = req.body.passphrase.toString()

    var row = await db.db_retrieveSecret(id)
    if (!row.data)
      return next({status: 404, message: 'Secret with that ID does not exist or has been deleted.'})
    row = row.data

    // NOTE: unsure if this check should be applied here as if an unauthorized party did end up
    // guessing the correct passphrase through this the secret would be destroyed anyway without
    // returning any of the interesting details.
    //
    // might be worth looking into whether the database functions being async vs not exposes any
    // transactional time that you could potentially exploit a non-response?
    if (row.access_failed_attempts >= 6)
      return next({status: 429, message: 'Too many unsuccessful access attempts; the requested secret is locked.'})

    if(bcrypt.compareSync(passphrase, row.passphrase)) {
      db.db_deleteSecret(id)
      return res.status(200).send()
    } else {
      db.db_incrementSecretFailedAccess(id)
      return next({status: 401, message: 'Unauthorized.'})
    }
  } catch (err) {
    return next({status: 500, error: err})
  }
}
