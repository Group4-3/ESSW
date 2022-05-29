/*
    ----- GROUP 4-3 Header -----
    Component Name: v1/submit_secret
    Date of Creation: 28/05/2022
    Description: Route to submit the secret
    Author(s): Petri Bayley & Mitchell Sundstrom

*/

import express from 'express';
import * as db from '../modules/group43_database.js';
var router = express.Router();

router.post('/api/v1/secret/submit', (req, res) => {
    let secret_id = "0";
    let secret_text = "Hello World";
    let passphrase = "1";
    let expiryDate = "05/06/2022 02:02:02";
    let method = "1";

    let result = db.db_addSecret({
        "secret_id": secret_id, 
        "secret_text": secret_text, 
        "passphrase": passphrase, 
        "expiryDate": expiryDate, 
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