/**
 * Users route
 */

const { gateway } = require('../../../lib/config')
const { salt, hash, error } = require('../../../lib/helpers')
const { app, router } = require('../../../lib/router')('/users')

router.get('/', (req, res, next) => {
    res.send("this is the users list")
})

router.post('/', (req, res, next) => {
    const username = req.body.username ? req.body.username : null
    const password = req.body.password ? req.body.password : null

    if (username && password) {
        const passwordSalt = salt()
        const passwordHash = hash(password + salt)

        try {
            gateway.createUser(username, passwordHash, passwordSalt)
        }
        catch (err) {
            next(err)
        }
        res.send("User created")
    }
    
    next(error(400, "Missing required fields"))
})

module.exports = app