/**
 * Token routes
 */
const userValidator = require('../../../lib/validation/user_validator')
const tokenValidator = require('../../../lib/validation/token_validator')
const db = require('../../../lib/gateways/db')
const { hash, salt, createToken } = require('../../../lib/helpers')
const { tokenExpiration } = require('../../../lib/config')
const error = require('../../../lib/error')

const { app, router } = require('../../../lib/router')('/tokens')

router.post('/', (req, res, next) => {
    try {
        const username = userValidator.username(req.body.username)
        const password = userValidator.password(req.body.password)

        const user = db.getUserByName(username)
        const passwordHash = hash(password + salt)

        if (user.hash === passwordHash) {
            const token = createToken(username)
            db.storeToken(token)
            res.send(token.id)
            return
        }
        next(error.credentials())
    }
    catch(err) {
        next(err)
        return
    }
})

router.get('/:tokenID', (req, res, next) => {
    try {
        const tokenID = tokenValidator.tokenID(req.params.tokenID)
        const token = db.getTokenById(tokenID)
        res.json(token)
    }
    catch (err) {
        next(err)
    }
})

router.put('/:tokenID', (req, res, next) => {
    try {
        const tokenID = tokenValidator.tokenID(req.params.tokenID)

        const token = tokenValidator.valid(db.getTokenById(tokenID))
        
        // Extending token expiration date
        token.expires = Date.now() + tokenExpiration
        res.send("OK")
    }
    catch (err) {
        next(err)
    }
})

router.delete('/:tokenID', (req, res, next) => {
    try {
        const tokenID = tokenValidator.tokenID(req.params.tokenID)
        db.deleteToken(tokenID)
        res.send("OK")
    }
    catch (err) {
        next(err)
    }
})

module.exports = app