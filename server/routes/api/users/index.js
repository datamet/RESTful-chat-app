/**
 * Users route
 */

const db = require('../../../lib/gateways/db')
const error = require('../../../lib/error')
const { salt, hash } = require('../../../lib/helpers')
const userValidator = require('../../../lib/validation/user_validator')
const { app, router } = require('../../../lib/router')('/users')

// Get list of users
router.get('/', (req, res, next) => {
    try{
        res.send(db.getUsers)
    }catch (err){
        next(err)
    }
})

router.get('/username', (req, res, next) => {
    try{
        res.send(db.getUser(req.body.username))
    }catch (err){
        next(err)
    }
})

// Create user
router.post('/', (req, res, next) => {
    try {
        const username = userValidator.username(req.body.username)
        const password = userValidator.password(req.body.password)

        const passwordSalt = salt()
        const passwordHash = hash(password + salt)
    
        db.createUser(username, passwordHash, passwordSalt)
        res.send("OK")
    }
    catch (err) {
        next(err)
    }
})

// Delete user
router.delete('/', (req, res, next) => {
    try{
        // Her er jeg litt usikker på hvordan jeg skal få tak i token fra url
        db.deleteUser(db.getTokenById(req.body.token), req.body.username);
    }catch (err){
        next(err)
    }
})

module.exports = app