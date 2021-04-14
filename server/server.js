/**
 * Express Application
 */

// Imports
const express = require('express')
const path = require('path')

const createWS = require('./lib/ws')
const http = require('http')

const cors = require('cors')
const bodyParser = require('./middleware/bodyParser')
const authenticator = require('./middleware/authenticator')
const apiRouter = require('./routes/api/api.routes')
const errorHandler = require('./middleware/errorHandler')

// Creating server
const server = http.createServer()

// Creating express app and passing it to server
const app = express()
server.on('request', app)

// Create websoket app and passing server to it
const ws = createWS(server)

// Path to static frontend
const public_path = path.join(__dirname, '../app/public')

// Using app level middleware
app.use(cors())                         // Enabeling cross origin requests
app.use(bodyParser)                     // Parsing body to json
app.use(authenticator)                  // Validates that the user has access to resource
app.use(apiRouter)                      // Passing request to router
app.use(express.static(public_path))    // Using static router to deliver frontend application
app.use(errorHandler)                   // Handeling erros and sending them back to the client

module.exports = { server }