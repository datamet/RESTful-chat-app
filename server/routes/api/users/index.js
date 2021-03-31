/**
 * Users route
 */

const db = require('../../../lib/gateways/db')
const error = require('../../../lib/error')
const { salt, hash } = require('../../../lib/helpers')
const { app, router } = require('../../../lib/router')('/users')

// Get list of users
router.get('/', (req, res, next) => {
    res.send("this is the users list")
})

// Create user
router.post('/', (req, res, next) => {
    try {
        const username = userValidator.username(req.body.username)
        const password = userValidator.passworrd(req.body.password)

        const passwordSalt = salt()
        const passwordHash = hash(password + salt)
    
        const userID = db.createUser(username, passwordHash, passwordSalt)
        res.send(userID)
    }
    catch (err) {
        next(err)
    }
})

// Delete user
router.delete('/', (req, res, next) => {
    
})

module.exports = app