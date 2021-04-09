/**
 * Express Application
 */

// Imports
const express = require('express')
const path = require('path')

const socketserver = require('./lib/soketserver')
const http = require('http')

const cors = require('cors')
const bodyParser = require('./middleware/bodyParser')
const authenticator = require('./middleware/authenticator')
const apiRouter = require('./routes/api/api.routes')
const errorHandler = require('./middleware/errorHandler')

// Creating app
const app = express()

// Creating web socket server
const wsapp = express()
const wss = http.createServer(wsapp)
const ws = socketserver(wss)

// Path to frontend application
const public = path.join(__dirname, '../app/public')

// Using app level middleware
app.use(cors())
app.use(bodyParser)
app.use(authenticator)
app.use(apiRouter)
app.use(express.static(public))
app.use(errorHandler)

module.exports = { app, wss }