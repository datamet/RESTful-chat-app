/**
 * Express Application
 */

// Imports
const express = require('express')

const cors = require('cors')
const bodyParser = require('./middleware/bodyParser')
const authenticator = require('./middleware/authenticator')
const apiRouter = require('./routes/api/api.routes')
const errorHandler = require('./middleware/errorHandler')

// Creating app
const app = express()

// Using app level middleware
app.use(cors())
app.use(bodyParser)
app.use(authenticator)
app.use(apiRouter)
app.use(errorHandler)

module.exports = app