/*
    ----- GROUP 4-3 Header -----
    Component Name: v1/get_secret
    Date of Creation: 28/05/2022
    Description: Route to get the secret
    Author(s): Petri Bayley & Mitchell Sundstrom

*/

import express from 'express';
import * as db from '../modules/group43_database.js';
var router = express.Router();

router.post('/api/v1/secret/get', (req, res) => {
    let secret_id = "0";
    let secret_passphrase = "2";

    //Insert password hashing
    let passphrase = db.db_retrievePassphrase(secret_id);
    if(!passphrase.data){
        res.json({
            def_res_url: req.url,
            def_res_code: 401,
            def_res_msg: "Unauthorized",
            msg_data: null
        });
        return;
    }

    //TODO: Compare passphrases using bcrypt
    if (passphrase.data.passphrase === secret_passphrase) {
        let secret = db.db_retrieveSecret(secret_id);
        if(!secret.data)
        {
            res.json({
                def_res_url: req.url,
                def_res_code: 401,
                def_res_msg: "Unauthorized",
                msg_data: null
            });
            return;
        }
        res.json({
            def_res_url: req.url,
            def_res_code: 200,
            def_res_msg: "OK",
            msg_data: secret.data
        });
    }
    else {
        db.db_incrementSecretFailedAccess(secret_id);
        res.json(
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