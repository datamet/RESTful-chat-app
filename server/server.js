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

// Creating web socket server
const server = http.createServer()

// Creating rest app and passing it to server
const app = express()
server.on('request', app)

// Create websoket app and passing it server
const ws = createWS(server)

// Path to frontend application
const public_path = path.join(__dirname, '../app/public')

// Using app level middleware
app.use(cors())
app.use(bodyParser)
app.use(authenticator)
app.use(apiRouter)
app.use(express.static(public_path))
app.use(errorHandler)

module.exports = { server }