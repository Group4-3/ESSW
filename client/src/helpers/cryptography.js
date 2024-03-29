/*
    ----- GROUP 43 Header -----
    Component Name: group43_client_helpers_cryptography
    Description: Helper library for client-side cryptography
    Date of Creation: 6/10/2022
    Author(s): Petri Bayley

*/


import { JSEncrypt } from "jsencrypt";

/*
    Convert an ArrayBuffer into a String
    from https://developer.chrome.com/blog/how-to-convert-arraybuffer-to-and-from-string/
*/
function ab2str(buffer){
  return String.fromCharCode.apply(null, Array.from(new Uint8Array(buffer)));      
}

/*
    Convert an String into a ArrayBuffer
    from https://developer.chrome.com/blog/how-to-convert-arraybuffer-to-and-from-string/
*/
function str2ab(str) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

export async function generateKeyPair() {
    var keyPair = await window.crypto.subtle.generateKey(
        {
            name: 'RSA-OAEP',
            modulusLength: 4096,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: {name: 'SHA-512'}
        },
        true,
        ['encrypt', 'decrypt']
    );

    var privateKey = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey)
    const privateKeyString = ab2str(privateKey)
    const privateKeyBase64 = window.btoa(privateKeyString)
    const privateKeyPem = `-----BEGIN PRIVATE KEY-----\n${privateKeyBase64}\n-----END PRIVATE KEY-----`

    // To ensure same format
    var key = new JSEncrypt()
    key.setPrivateKey(privateKeyPem)

    return { 
        privateKey: key.getPrivateKey().replace('-----BEGIN RSA PRIVATE KEY-----','-----BEGIN PRIVATE KEY-----').replace('-----END RSA PRIVATE KEY-----','-----END PRIVATE KEY-----'), 
        publicKey: key.getPublicKey() 
    }
}

export async function privateToPublicKey(privateKey) {
    var key = new JSEncrypt()
    key.setPrivateKey(privateKey)
    return key.getPublicKey()
}

export function decryptUsingPrivateKey(buffer, privateKey) {
    var key = new JSEncrypt()
    key.setPrivateKey(privateKey)
    return key.decrypt(buffer)
}

export function encryptUsingPublicKey(buffer, publicKey) {
    var key = new JSEncrypt()
    key.setPublicKey(publicKey)
    return key.encrypt(buffer)
}