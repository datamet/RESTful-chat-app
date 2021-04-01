/**
 * Responsible for creating application
 */

// App imports
const express = require('express')
const bodyParser = require('./middleware/parse_body')
const errorHandler = require('./middleware/error_handler')
const authHandler = require('./middleware/auth_handler')

// Creating app
const app = express()

// Using app level middleware
app.use(bodyParser)
app.use(authHandler)

// Route imports
const routes = require('./routes')

// Using routes
app.use(routes)

// Using error middleware
app.use(errorHandler)

module.exports = app