const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const errorhandler = require('errorhandler')

const isProduction = process.env.NODE_ENV === 'production'

const app = express()

app.use(helmet())
app.use(cors())
app.use(morgan('combined'))

app.use('/api/v1', require('./routes/v1'))

let server = app.listen(process.env.PORT || 3001, () => {
  console.log('listening on port ' + server.address().port)
})
