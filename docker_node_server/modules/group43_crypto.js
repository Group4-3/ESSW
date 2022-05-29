/*
    ----- GROUP 4-3 Header -----
    Component Name: group43_crypto
    Date of Creation: 29/05/2022
    Description: Encryption Driver
    Author(s): Mitchell Sundstrom

*/


import Crypto from 'crypto-js';

const keySize = 256
const ivSize = 128
const iterations = 100

export function crypto_encryptAes(body, passphrase) {
    var salt = Crypto.lib.WordArray.random(128/8)
    var iv = Crypto.lib.WordArray.random(ivSize/8)
    var key = Crypto.PBKDF2(passphrase, salt, {
      keySize: keySize/32,
      iterations: iterations
    })
  
    var encrypted = Crypto.AES.encrypt(body, key, {
      iv: iv,
      padding: Crypto.pad.Pkcs7,
      mode: Crypto.mode.CBC,
      hasher: Crypto.algo.SHA256
    })
  
    return salt.toString() + iv.toString() + encrypted.toString()
}

export function crypto_decryptAes(body, passphrase) {
    var salt = Crypto.enc.Hex.parse(body.substr(0, 32))
    var iv = Crypto.enc.Hex.parse(body.substr(32, 32))
    var encrypted = body.substring(64)
  
    var key = Crypto.PBKDF2(passphrase, salt, {
      keySize: keySize/32,
      iterations: iterations
    })
  
    var decrypted = Crypto.AES.decrypt(encrypted, key, {
      iv: iv,
      padding: Crypto.pad.Pkcs7,
      mode: Crypto.mode.CBC,
      hasher: Crypto.algo.SHA256
    })
  
    return decrypted.toString(Crypto.enc.Utf8)
}