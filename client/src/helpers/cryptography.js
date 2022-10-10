/*
    ----- GROUP 43 Header -----
    Component Name: group43_client_helpers_cryptography
    Description: Helper library for client-side cryptography
    Date of Creation: 6/10/2022
    Author(s): Petri Bayley

*/

/*
    Convert an ArrayBuffer into a string
    from https://developer.chrome.com/blog/how-to-convert-arraybuffer-to-and-from-string/
*/
function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

/*
    Convert an String into a ArrayBuffer
    from https://developer.chrome.com/blog/how-to-convert-arraybuffer-to-and-from-string/
*/
function str2ab(str) {
    var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

export async function generateKeyPair() {
    var keyPair = await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 4096,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: {name: "SHA-512"}
        },
        true,
        ["encrypt", "decrypt"]
    );

    // Test


    var privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey)
    const privateKeyString = ab2str(privateKey)
    const privateKeyBase64 = window.btoa(privateKeyString)
    const privateKeyPem = `-----BEGIN PRIVATE KEY-----\n${privateKeyBase64}\n-----END PRIVATE KEY-----`

    var publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey)
    const publicKeyString = ab2str(publicKey)
    const publicKeyBase64 = window.btoa(publicKeyString)
    const publicKeyPem = `-----BEGIN PUBLIC KEY-----\n${publicKeyBase64}\n-----END PUBLIC KEY-----`

    return { privateKey: privateKeyPem, publicKey: publicKeyPem }
}

export async function privateToPublicKey(privateKey) {
    console.log(privateKey.replace('-----BEGIN PUBLIC KEY-----\n','').replace('\n-----END PUBLIC KEY-----',''));
    
}

export function decryptUsingPrivateKey(buffer, privateKey) {
}