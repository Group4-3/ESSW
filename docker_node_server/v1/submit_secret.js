/*
    ----- GROUP 4-3 Header -----
    Component Name: v1/submit_secret
    Date of Creation: 28/05/2022
    Description: Route to submit the secret
    Author(s): Petri Bayley & Mitchell Sundstrom

*/

import express from 'express';
var router = express.Router();

router.post('/api/v1/secret/submit', (req, res) => {
    res.json(
        {
            def_res_url: req.url,
            def_res_code: 200,
            def_res_msg: "OK"
        }
        );
});

export { router }