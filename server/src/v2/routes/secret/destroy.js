/*
    ----- GROUP 43 Header -----
    Component Name: Secret/Destroy
    Description: Burn a secret from the system
    Date of Creation: 02/06/2022
    Author(s): Mitchell Sundstrom
*/

import bcrypt from 'bcrypt'

export function secretDestroy(req, res, next) {
  return next({status: 501, message: "Not Implemented"})
}
