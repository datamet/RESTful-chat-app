/**
 * Users route
 */

const db = require('../../../lib/gateways/db')
const error = require('../../../lib/error')
const { salt, hash } = require('../../../lib/helpers')
const userValidator = require('../../../lib/validation/user_validator')
const token_validator = require('../../../lib/validation/token_validator')
const { app, router } = require('../../../lib/router')('/users')

// Get list of users
router.get('/', (req, res, next) => {
    try{
        const users = db.getUsers()
        const jsonUsers = { "users" : [] }
        for (const user of users) {
            delete user["hash"]
            delete user["salt"]
            delete user["tokens"]
            jsonUsers["users"].push(user)
        }
        res.json(jsonUsers)
    }catch (err){
        next(err)
    }
})

router.get('/:userID', (req, res, next) => {
    try{
        const user = db.getUserById(req.params.userID)
        delete user["hash"]
        delete user["salt"]
        delete user["tokens"]
        res.json(user)
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
        res.json({ "message" : "User created" })
    }
    catch (err) {
        next(err)
    }
})

// Delete user
router.delete('/:userID', (req, res, next) => {
    try{
        const userID = req.params.userID

        const tokenID = req.header('Token')
        const token = db.getTokenById(tokenID)

        if (token.userID === userID) {
            db.deleteUser(userID);
            res.send({ "message" : "User deleted" })
            return
        }
        next(error.authentication())
    }catch (err){
        next(err)
    }
})

module.exports = app