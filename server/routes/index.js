/**
 * Routes
 */

// Importing subroutes
const api = require('./api')

// Creating router
const { app } = require('../lib/router')('/', [api])

module.exports = app