/*
    ----- GROUP 4-3 Header -----
    Component Name: v1/info_for_nerds
    Date of Creation: 28/05/2022
    Description: Route to get info about the API like version
    Author(s): Petri Bayley

*/

import express from 'express';
var router = express.Router();

router.post('/api/v1/info_for_nerds', (req, res) => {
    res.status(200).json(
        {
            def_res_url: req.url,
            def_res_code: 418,
            def_res_msg: "OK",
            version_major: 0, version_minor: 1, version_patch: 0 
        }
        );
});

export { router }