/**
 * Validator for tokens
 */

const error = require('../../../lib/error')

const validator = {}

// validates tokenID
validator.tokenID = (tokenID) => {
    if (!tokenID) throw error.authentication()
    const string = typeof tokenID === 'string'
    const length = tokenID.length === 36
    if (!string) throw error.invalid()
    if (!length) throw error.custom(403, "TokenID must be 36 characters long")
    return tokenID
}

// Checks if token is still valid
validator.valid = (token) => {
    if (token.expires > Date.now()) return token
    else throw error.expired()
}

module.exports = validator