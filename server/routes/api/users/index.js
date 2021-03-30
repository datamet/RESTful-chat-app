/**
 * Users route
 */

const { gateway } = require('../../../lib/config')
const error = require('../../../lib/error')
const { salt, hash } = require('../../../lib/helpers')
const { app, router } = require('../../../lib/router')('/users')

// Get list of users
router.get('/', (req, res, next) => {
    res.send("this is the users list")
})

// Create user
router.post('/', (req, res, next) => {
    const username = req.body.username ? req.body.username : null
    const password = req.body.password ? req.body.password : null

    if (username && password) {
        const passwordSalt = salt()
        const passwordHash = hash(password + salt)

        try {
            gateway.createUser(username, passwordHash, passwordSalt)
            res.send("OK")
        }
        catch (err) {
            next(err)
        }
        return
    }
    
    next(error.missing())
})

// Delete user
router.delete('/', (req, res, next) => {
    
})

module.exports = app