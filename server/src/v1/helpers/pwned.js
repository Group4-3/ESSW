import fetch from 'node-fetch'
import crypto from 'crypto-js'

export async function pwnedPassphrase(passphrase) {
  var sha1 = crypto.SHA1(passphrase).toString()
  var prefix = sha1.substring(0, 5)
  var suffix = sha1.substring(5)

  var response = await fetch('https://api.pwnedpasswords.com/range/' + prefix, { method: 'get' })
  var body = await response.text()
  body = body.toLowerCase().replace(/:\d+/g, '').split("\r\n")

  var pwned = body.includes(suffix)

  return pwned
}
