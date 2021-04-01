/**
 * Express Application
 */

// Imports
const express = require('express')

const bodyParser = require('./middleware/parse_body')
const authenticator = require('./middleware/auth_handler')
const apiRouter = require('./routes/api/api.routes')
const errorHandler = require('./middleware/error_handler')

// Creating app
const app = express()

// Using app level middleware
app.use(bodyParser)
app.use(authenticator)
app.use(apiRouter)
app.use(errorHandler)

module.exports = app