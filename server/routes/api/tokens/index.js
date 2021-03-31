/**
 * Token routes
 */
const userValidator = require('../../../lib/validation/user_validator')
const db = require('../../../lib/gateways/db')
const { hash, salt, createToken } = require('../../../lib/helpers')
const helpers = require('../../../lib/helpers')
const error = require('../../../lib/error')

const { app, router } = require('../../../lib/router')('/tokens')

router.post('/', (req, res) => {
    const username = userValidator.username(req.body.username)
    const password = userValidator.passworrd(req.body.password)

    const user = db.getUserByName(username)
    const passwordHash = hash(password + salt)

    if (user.hash === passwordHash) {
        const token = createToken(username)
        db.storeToken(token)
        res.send(token.id)
        return
    }
    throw error.credentials()
})

module.exports = app