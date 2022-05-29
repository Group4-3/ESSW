/*
    ----- GROUP 4-3 Header -----
    Component Name: v1/get_secret
    Date of Creation: 28/05/2022
    Description: Route to get the secret
    Author(s): Petri Bayley & Mitchell Sundstrom

*/

import express from 'express';
import * as db from '../modules/group43_database.js';
import * as secrets from '../modules/group43_secrets.js';
import { crypto_decryptAes } from '../modules/group43_crypto.js';
import bcrypt from 'bcrypt';
var router = express.Router();

router.post('/api/v1/secret/get', (req, res) => {
    let secret_id = req.body.secret_id;
    let secret_passphrase = req.body.passphrase;

    //Insert password hashing
    let passphrase = db.db_retrievePassphrase(secret_id);
    if(!passphrase.data){
        res.status(401).json({
            def_res_url: req.url,
            def_res_code: 401,
            def_res_msg: "Unauthorized",
            msg_data: null
        });
        return;
    }

    if (bcrypt.compareSync(secrets.pepper+secret_passphrase, passphrase.data.passphrase)) {
        let secret = db.db_retrieveSecret(secret_id);
        if(!secret.data)
        {
            res.status(401).json({
                def_res_url: req.url,
                def_res_code: 401,
                def_res_msg: "Unauthorized",
                msg_data: null
            });
            return;
        }
        let decyptedSecret = crypto_decryptAes(secret.data.secret_text, secrets.pepper+secret_passphrase);
        res.status(200).json({
            def_res_url: req.url,
            def_res_code: 200,
            def_res_msg: "OK",
            msg_data: decyptedSecret
        });
        db.db_deleteSecret(secret_id);
    }
    else {
        db.db_incrementSecretFailedAccess(secret_id);
        res.status(401).json(
            {
                def_res_url: req.url,
                def_res_code: 401,
                def_res_msg: "Unauthorized",
                msg_data: null
            }
        );
    }
});

export { router }