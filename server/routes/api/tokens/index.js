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

// Creating token (Logging in)
router.post('/', (req, res, next) => {
    try {
        const username = typeof req.body.username === 'string' ? req.body.username : ""
        const password = typeof req.body.password === 'string' ? req.body.password : ""

        let user
        // Checking if user exists
        try {
            user = db.getUserByName(username)
        }
        catch (err) {
            next(error.credentials())
            return
        }
        const passwordHash = hash(password + salt)

        // Checking if password matches
        if (user.hash === passwordHash) {
            const token = createToken(user.id)
            db.storeToken(token)
            res.json({ 
                "token" : token.id,
                "message" : "Logged in"
            })
            return
        }
        next(error.credentials())
    }
    catch(err) {
        next(err)
    }
})

// Returning token based on an id
router.get('/:tokenID', (req, res, next) => {
    try {
        const tokenID = tokenValidator.tokenID(req.params.tokenID)
        const token = db.getTokenById(tokenID)
        const jsonToken = { "token" : token }
        res.json(jsonToken)
    }
    catch (err) {
        next(err)
    }
})

// Extending session
router.put('/:tokenID', (req, res, next) => {
    try {
        const tokenID = tokenValidator.tokenID(req.params.tokenID)

        const token = tokenValidator.valid(db.getTokenById(tokenID))
        
        // Extending token expiration date
        token.expires = Date.now() + tokenExpiration
        res.json({ "message" : "Session extended" })
    }
    catch (err) {
        next(err)
    }
})

// Delete token (Logging out)
router.delete('/:tokenID', (req, res, next) => {
    try {
        const tokenID = tokenValidator.tokenID(req.params.tokenID)
        db.deleteToken(tokenID)
        res.send({ "message" : "Logged out"})
    }
    catch (err) {
        next(err)
    }
})

module.exports = app