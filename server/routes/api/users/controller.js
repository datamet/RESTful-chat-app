/**
 * User controller
 */

// imports
 const db = require('../../../lib/db')
 const error = require('../../../lib/error')
 const validator = require('./validator')
 const auth = require('../../../lib/auth')

const createUser = async (req, res, next) => {
    const username = validator.username(req.body.username)
    const password = validator.password(req.body.password)
    
    const passwordSalt = auth.salt()
    const passwordHash = auth.hash(password + passwordSalt)

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