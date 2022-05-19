var crypto = require('crypto-js')

const encrypt = (body, passphrase, method) => {
  return false
}

const decrypt = (encrypted_body, passphrase, method) => {
  return false
}

const generateIdentifier = () => {
  return crypto.lib.WordArray.random(128/8).toString()
}

module.exports = {
  encrypt,
  decrypt,
  generateIdentifier
}
