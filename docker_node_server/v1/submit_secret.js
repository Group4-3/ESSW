/*
    ----- GROUP 4-3 Header -----
    Component Name: v1/submit_secret
    Date of Creation: 28/05/2022
    Description: Route to submit the secret
    Author(s): Petri Bayley & Mitchell Sundstrom

*/

import express from 'express';
import * as db from '../modules/group43_database.js';
import * as secrets from '../modules/group43_secrets.js';
import { crypto_encryptAes } from '../modules/group43_crypto.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto-js';
import fetch from 'node-fetch';

var router = express.Router();

router.post('/api/v1/secret/submit', async (req, res) => {
    let secret_id = crypto.lib.WordArray.random(128/8).toString();
    let secret_text = req.body.secret_text;
    let passphrase = req.body.passphrase;
    let expiry_date = req.body.expiry_date//"05/06/2022 02:02:02";
    let method = req.body.encryption_method;

    var pwn_sha1 = crypto.SHA1(passphrase).toString();
    var pwn_prefix = pwn_sha1.substring(0, 5);
    var pwn_suffix = pwn_sha1.substring(5);
    var pwn_response = await fetch('https://api.pwnedpasswords.com/range/' + pwn_prefix, { method: 'get' });
    var pwn_body = await pwn_response.text();
    pwn_body = pwn_body.toLowerCase().replace(/:\d+/g, '').split("\r\n");
    if(body.includes(pwn_suffix))
    {
        res.json({
            def_res_url: req.url,
            def_res_code: 400,
            def_res_msg: "Password found ot be insecure",
            msg_data: null
        });
        return;
    }

    let passphrase_hashed = bcrypt.hashSync(secrets.pepper+passphrase, 10);
    let secret_encrypted = crypto_encryptAes(secret_text, secrets.pepper+passphrase);

    let result = db.db_addSecret({
        "secret_id": secret_id, 
        "secret_text": secret_encrypted,
        "passphrase": passphrase_hashed, 
        "expiry_date": expiry_date, 
        "method": method
    });

    if(result.code == 200)
    {
        res.json({
            def_res_url: req.url,
            def_res_code: 200,
            def_res_msg: "OK",
            msg_data: { "secret_id": secret_id }
        });
    }
    else
    {
        res.json({
            def_res_url: req.url,
            def_res_code: 500,
            def_res_msg: "Unable to insert secret"
        });
    }
});

export { router }