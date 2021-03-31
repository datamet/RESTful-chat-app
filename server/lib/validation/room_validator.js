const error = require('../error')

const validator = {}

validator.name = (name) => {
    if (!name) throw error.missing()
    const string = typeof name === 'string'
    const length = name.length >= 3
    if (!string) throw error.invalid()
    if (!length) throw error.custom(403, "Room name must be 3 characters or longer")
    return name
}

module.exports = validator