/**
 * Responsible for starting application
 */

// App imports
const express = require('express')
const config = require('./lib/config.js')
const bodyParser = require('./middleware/parse_body')
const errorHandler = require('./middleware/error_handler')

// Creating app
const app = express()

// Using app level middleware
app.use(bodyParser)

// Route imports
const routes = require('./routes')

// Using routes
app.use(routes)

// Using error middleware
app.use(errorHandler)

// Starting server
app.listen(config.port, () => {
    console.log(`starting server on ${config.port} in ${config.mode} mode`)
});