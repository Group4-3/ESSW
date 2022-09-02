/*
    ----- GROUP 43 Header -----
    Component Name: Passphrase/Validate
    Description: Check if a given passphrase has been leaked online
    Date of Creation: 02/06/2022
    Author(s): Mitchell Sundstrom
*/

import fetch from 'node-fetch'
import crypto from 'crypto-js'

export async function validate(req, res, next) {
  try {
    if (!req.body.hasOwnProperty('passphrase'))
      return next({message: 'Missing required body param: `passphrase`.'})
    var pp = req.body.passphrase.toString()

    var sha1 = crypto.SHA1(pp).toString()
    var prefix = sha1.substring(0, 5)
    var suffix = sha1.substring(5)

    var http = await fetch('https://api.pwnedpasswords.com/range/' + prefix, { method: 'get' })
    var body = await http.text()

    var formattedBody = body.toLowerCase().replace(/:\d+/g, '').split("\r\n")
    var pwned = formattedBody.includes(suffix)

    const response = {
      pwned: pwned,
      sha1: sha1,
      prefix: prefix,
      suffix: suffix
    }

    return res.status(200).json(response)
  } catch (err) {
    return next({status: 500, error: err.message})
  }
}
