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
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as errorhandler from 'errorhandler';
import * as db from './modules/group43_database.js';

const isProduction = process.env.NODE_ENV === 'production'

const app = express()

app.use(helmet())
app.use(cors())
app.use(morgan('combined'))

app.use('/api/v1', require('./routes/v1'))

let server = app.listen(process.env.PORT || 3001, () => {
  console.log('listening on port ' + server.address().port)
})
