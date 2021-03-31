const error = require('../error')

const validator = {}

validator.tokenID = (tokenID) => {
    if (!tokenID) throw error.missing()
    const string = typeof tokenID === 'string'
    const length = tokenID.length === 36
    if (!string) throw error.invalid()
    if (!length) throw error.custom(403, "TokenID must be 36 characters long")
    return tokenID
}

validator.valid = (token) => {
    if (token.expires < Date.now()) return token
    else throw error.authentication()
}

module.exports = validator