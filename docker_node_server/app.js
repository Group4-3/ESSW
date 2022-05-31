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
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import errorhandler from 'errorhandler'
import swagger from 'swagger-jsdoc'
import swaggerui from 'swagger-ui-express'

const isProduction = process.env.NODE_ENV === 'production'

const app = express()
app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

import { router as v1 } from './src/v1/index.js'
import { router as v2 } from './src/v2/index.js'

app.use('/api/v1', v1)
app.use('/api/v2', v2)

const server = app.listen(process.env.PORT || 3001, () => {
  console.log('listening on port ' + server.address().port)
})

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "ESSW",
      description: "test",
      servers: []
    }
  },
  apis: [
    './src/v1/secret.js'
  ]
}
const swaggerDocs = swagger(swaggerOptions)
app.use('/api-docs', swaggerui.serve, swaggerui.setup(swaggerDocs))
