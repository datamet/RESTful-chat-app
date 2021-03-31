/**
 * API routes
 */

// Importing subroutes
const users = require('./users')
const tokens = require('./tokens')

// Creating sub-router
const { app } = require('../../lib/router')('/api', [users, tokens])



module.exports = app