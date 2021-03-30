/**
 * API routes
 */

// Importing subroutes
const users = require('./users')

// Creating sub-router
const { app, router, gateway } = require('../../lib/router')('/api', [users])

module.exports = app