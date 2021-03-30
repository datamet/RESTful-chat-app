/**
 * Responsible for starting application
 */

// App imports
const express = require('express')
const config = require('./lib/config.js')

// Creating app
const app = express()

// Route imports
const api = require('./routes/api')

// Using routes
app.use(api)

// Starting server
app.listen(config.port, () => {
    console.log(`starting server on ${config.port} in ${config.mode}`)
});