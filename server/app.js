/*
    ----- GROUP 4-3 Header -----
    Component Name: Server Application
    Date of Creation: 27/04/2022
    Description: Main server application for the API
    Author(s): Petri Bayley & Mitchell Sundstrom

*/

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import errorhandler from 'errorhandler'

const isProduction = process.env.NODE_ENV === 'production'

const app = express()
app.use(helmet())
app.use(cors())
app.use(morgan('combined', {
  skip: (req, res) => {
    return ['test'].includes(process.env.NODE_ENV)
  }
}))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

import { router as v2 } from './src/v2/routes/index.js'

app.use('/api/v2', v2)

app.use(express.static('public'))

app.use((err, req, res, next) => {
  res.status(err.status || 400).json({
    message: err.message || 'An unexpected error occurred.',
    errors: err.error
  })
})

app.use((req, res) => {
  res.status(404).json({
    message: 'The requested resource could not be found.'
  })
})

const server = app.listen(process.env.NODE_PORT || 3001, () => {
  console.log('Listening on port ' + server.address().port + ' in ' + process.env.NODE_ENV + ' mode')
})

export { app, server }
