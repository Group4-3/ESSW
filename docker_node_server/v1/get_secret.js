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
    let result = db.db_retrieveSecret("0", "1");
    console.log(result);
    res.json(
        { 
            def_res_url: req.url,
            def_res_code: 200,
            def_res_msg: "OK",
            msg_data: result.data
        }
        );
});

export { router }