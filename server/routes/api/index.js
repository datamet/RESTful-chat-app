/**
 * API routes
 */

// Importing subroutes
const users = require('./users')
const tokens = require('./tokens')
const rooms = require('./rooms')

// Creating sub-router
const { app } = require('../../lib/router')('/api', [users, tokens, rooms])

module.exports = app