/**
 * Handles crypto
 */

const crypto = require('crypto')
const { tokenExpiration } = require('./config')
const { secret } = require('./keys')

const auth = {}

// Hashing with help from nodejs crypto
auth.hash = str => {
    return crypto.createHmac('sha256', secret).update(str).digest('hex')
}

// Creating salt with Math.random()
auth.salt = () => {
    const salt_length = 10
    const salt = createRandomString(salt_length)
    return salt
}

// Creating token
auth.createToken = (userID) => {
    const newToken = {
        id: auth.uuid(),
        userID,
        expires: Date.now() + tokenExpiration
    }

    return newToken
}

auth.extendToken = (token) => {
    return {
        ...token,
        expires: Date.now() + tokenExpiration
    }
}

// Creating UUID. Complies with the UUID V4 rfc
auth.uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Creates random string with Math.random()
createRandomString = strLength => {
    return [...Array(strLength)].map(i=>(~~(Math.random()*36)).toString(36)).join('');
}

module.exports = auth