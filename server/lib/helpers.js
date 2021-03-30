const crypto = require('crypto')
const { secret } = require('./config')

const helpers = {}

helpers.hash = str => {
    if (typeof(str) === 'string' && str.length > 0) {
        const hash = crypto.createHmac('sha256', secret).update(str).digest('hex')
        return hash
    } else {
        return false
    }
}

helpers.salt = () => {
    const salt_length = 10
    const salt = helpers.createRandomString(salt_length)
    return salt
}

module.exports = helpers