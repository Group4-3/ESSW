const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const errorhandler = require('errorhandler')

const isProduction = process.env.NODE_ENV === 'production'

const app = express()

const db = require('./services/db')

const v1 = require('./routes/v1')
app.use('/api/v1/', v1)

app.use(helmet())
app.use(bodyParser.json())
app.use(cors())
app.use(morgan('combined'))
app.use(express.static(__dirname + '/public'))

let server = app.listen(process.env.PORT || 3001, () => {
  console.log('listening on port ' + server.address().port)
})
