/**
 * Validator for users
 */


const error = require('../../../lib/error')

const validator = {}

// Validates username
validator.username = (username) => {
    if (!username) throw error.missing()
    const string = typeof username === 'string'
    const length = username.length >= 3
    if (!string) throw error.invalid()
    if (!length) throw error.custom(403, "Username must be 3 or more characters")
    return username
}

// Validates password
validator.password = (password) => {
    if (!password) throw error.missing()
    const string = typeof password === 'string'
    const length = password.length >= 8
    if (!string) throw error.invalid()
    if (!length) throw error.custom(403, "Password must be 8 or more characters")
    return password
}

module.exports = validator