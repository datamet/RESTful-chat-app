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
        const reducedUsers = users.map(user => {return { "username" : user.username, "id" : user.id }})
        const jsonUsers = { "users" : reducedUsers }
        res.json(jsonUsers)
    }catch (err){
        next(err)
    }
})

// Get one user
router.get('/:userID', (req, res, next) => {
    try{
        const user = db.getUserById(req.params.userID)
        // Removing sensitive properties
        delete user["hash"]
        delete user["salt"]
        delete user["tokens"]
        const jsonUser = { "user" : user }
        res.json(jsonUser)
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
    
        const userID = db.createUser(username, passwordHash, passwordSalt)
        res.json({ "message" : "User created", "userID" : userID })
    }
    catch (err) {
        next(err)
    }
})

// Delete user
router.delete('/:userID', (req, res, next) => {
    try{
        const userToRemove = req.params.userID
        const authenticatedUser = req.user

        if (userToRemove === authenticatedUser) {
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