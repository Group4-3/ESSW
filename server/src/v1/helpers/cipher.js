import crypto from 'crypto-js';

const keySize = 256
const ivSize = 128
const iterations = 100

export function encrypt(body, passphrase, method) {
  return false
}

export function decrypt(encrypted_body, passphrase, method) {
  return false
}

export function generateIdentifier() {
  return crypto.lib.WordArray.random(128/8).toString()
}

/**
 * @deprecated
 */
export function encryptAesDemo(body, pass) {
  var salt = crypto.lib.WordArray.random(128/8)
  var iv = crypto.lib.WordArray.random(ivSize/8)
  var key = crypto.PBKDF2(pass, salt, {
    keySize: keySize/32,
    iterations: iterations
  })

  var encrypted = crypto.AES.encrypt(body, key, {
    iv: iv,
    padding: crypto.pad.Pkcs7,
    mode: crypto.mode.CBC,
    hasher: crypto.algo.SHA256
  })

  return salt.toString() + iv.toString() + encrypted.toString()
}

/**
 * @deprecated
 */
export function decryptAesDemo(body, pass) {
  var salt = crypto.enc.Hex.parse(body.substr(0, 32))
  var iv = crypto.enc.Hex.parse(body.substr(32, 32))
  var encrypted = body.substring(64)

  var key = crypto.PBKDF2(pass, salt, {
    keySize: keySize/32,
    iterations: iterations
  })

  var decrypted = crypto.AES.decrypt(encrypted, key, {
    iv: iv,
    padding: crypto.pad.Pkcs7,
    mode: crypto.mode.CBC,
    hasher: crypto.algo.SHA256
  })

  return decrypted.toString(crypto.enc.Utf8)
}
