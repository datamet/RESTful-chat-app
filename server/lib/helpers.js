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

helpers.createRandomString = strLength => {
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
    if (strLength) {
        return [...Array(strLength)].map(i=>(~~(Math.random()*36)).toString(36)).join('');
    } else {
        return false;
    }
}

module.exports = helpers