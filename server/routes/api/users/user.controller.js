/**
 * User controller
 */

// imports
 const db = require('../../../lib/gateways/db')
 const error = require('../../../lib/error')
 const userValidator = require('../../../lib/validation/user_validator')
 const { salt, hash } = require('../../../lib/helpers')

const createUser = async (req, res, next) => {
    const username = userValidator.username(req.body.username)
    const password = userValidator.password(req.body.password)
    
    const passwordSalt = salt()
    const passwordHash = hash(password + salt)

    const userID = await db.createUser(username, passwordHash, passwordSalt)
    res.json({ "message" : "User created", "userID" : userID })
}

const getUsers = async (req, res, next) => {
    const users = await db.getUsers()
    const reducedUsers = users.map(user => {return { "username" : user.username, "id" : user.id }})
    const jsonUsers = { "users" : reducedUsers }
    res.json(jsonUsers)
}

const getUser = async (req, res, next) => {
    const user = await db.getUserById(req.params.userID)
    
    // Removing sensitive properties
    delete user["hash"]
    delete user["salt"]
    delete user["tokens"]

    const jsonUser = { "user" : user }
    res.json(jsonUser)
}

const deleteUser = async (req, res, next) => {
    const userToRemove = req.params.userID

    if (userToRemove === req.user.id) {
        await db.deleteUser(userID);
        res.send({ "message" : "User deleted" })
        return
    }
    next(error.authentication())
}

module.exports = { 
    createUser, 
    getUsers, 
    getUser, 
    deleteUser 
}