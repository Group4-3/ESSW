/*
    ----- GROUP 43 Header -----
    Component Name: Cipher
    Description: Encryption helpers
    Date of Creation: 28/05/2022
    Author(s): Mitchell Sundstrom
*/

import crypto from 'crypto-js'

const idLength = 8/2
const keySize = 256/32
const nonceSize = 128/8
const ivSize = 128/8
const iterations = 100

export const methods = ['aes', 'des', 'tripledes', 'rabbit', 'rc4', 'rc4drop']

export function generateIdentifier() {
  return crypto.lib.WordArray.random(idLength).toString()
}

export function encrypt(body, passphrase, method = 'aes') {
  if (!methods.includes(method))
    return false

  var nonce = crypto.lib.WordArray.random(nonceSize)
  var key = createKey(passphrase, nonce)
  var config = {
    'iv': crypto.lib.WordArray.random(ivSize),
    'padding': crypto.pad.Pkcs7,
    'mode': crypto.mode.CBC,
    'hasher': crypto.algo.SHA256
  }

  return nonce.toString() + config.iv.toString() + ({
    'aes': crypto.AES.encrypt(body, key, config),
    'des': crypto.DES.encrypt(body, key, config),
    'tripledes': crypto.TripleDES.encrypt(body, key, config),
    'rabbit': crypto.Rabbit.encrypt(body, key, config),
    'rc4': crypto.RC4.encrypt(body, key, config),
    'rc4drop': crypto.RC4Drop.encrypt(body, key, config)
  })[method.toLowerCase()].toString()
}

export function decrypt(body, passphrase, method = 'aes') {
  if (!methods.includes(method))
    return false

  var nonce = crypto.enc.Hex.parse(body.substr(0, nonceSize*2))
  var key = createKey(passphrase, nonce)
  var encrypted_body = body.substring(nonceSize*2 + ivSize*2)
  var config = {
    'iv': crypto.enc.Hex.parse(body.substr(nonceSize*2, ivSize*2)),
    'padding': crypto.pad.Pkcs7,
    'mode': crypto.mode.CBC,
    'hasher': crypto.algo.SHA256
  }

  return ({
    'aes': crypto.AES.decrypt(encrypted_body, key, config),
    'des': crypto.DES.decrypt(encrypted_body, key, config),
    'tripledes': crypto.TripleDES.decrypt(encrypted_body, key, config),
    'rabbit': crypto.Rabbit.decrypt(encrypted_body, key, config),
    'rc4': crypto.RC4.decrypt(encrypted_body, key, config),
    'rc4drop': crypto.RC4Drop.decrypt(encrypted_body, key, config)
  })[method.toLowerCase()].toString(crypto.enc.Utf8)
}

function createKey(passphrase, nonce) {
  return crypto.PBKDF2(passphrase, nonce, {
    keySize: keySize,
    iterations: iterations
  })
}
