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
import bcrypt from 'bcrypt';
var router = express.Router();

router.post('/api/v1/secret/submit', (req, res) => {
    //TODO: Generate Secret ID
    let secret_id = req.body.secret_id;
    let secret_text = req.body.secret_text;
    let passphrase = req.body.passphrase;
    let expiry_date = req.body.expiry_date//"05/06/2022 02:02:02";
    let method = req.body.encryption_method;

    let passphrase_hashed = bcrypt.hashSync(secrets.pepper+passphrase, 10);

    let result = db.db_addSecret({
        "secret_id": secret_id, 
        "secret_text": secret_text, 
        "passphrase": passphrase_hashed, 
        "expiry_date": expiry_date, 
        "method": method
    });

    if(result.code == 200)
    {
        res.json({
            def_res_url: req.url,
            def_res_code: 200,
            def_res_msg: "OK"
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