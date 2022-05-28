/*
    ----- GROUP 4-3 Header -----
    Component Name: Server Application
    Date of Creation: 27/04/2022
    Description: Main server application for the API
    Author(s): Petri Bayley & Mitchell Sundstrom

*/

/*
  Modules
*/
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import errorhandler from 'errorhandler';
import * as db from './modules/group43_database.js';

const isProduction = process.env.NODE_ENV === 'production'

const app = express();
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

/*
  Routes

*/

import {router as secret_submit_route } from './v1/submit_secret.js';
app.use(secret_submit_route);

import {router as secret_get_route } from './v1/get_secret.js';
app.use(secret_get_route);

import {router as info_for_nerds_route } from './v1/info_for_nerds.js';
app.use(info_for_nerds_route);

let server = app.listen(process.env.PORT || 3001, () => {
  console.log('listening on port ' + server.address().port)
})
