/**
 * User controller
 */

// imports
const db = require('../../../lib/db')
const error = require('../../../lib/error')
const validator = require('./validator')
const auth = require('../../../lib/auth')
const activeUsers = require('../../../lib/pushnotify/connections')


const createUser = async (req, res, next) => {
    const username = validator.username(req.body.username)
    const password = validator.password(req.body.password)
    const bot = req.body.bot
    
    const passwordSalt = auth.salt()
    const passwordHash = auth.hash(password + passwordSalt)

    const userID = await db.createUser(username, passwordHash, passwordSalt, bot)
    activeUsers.notify({},activeUsers.USER)
    res.json({ message: "User created", userID })
}

const getUsers = async (req, res, next) => {
    const fullUsers = await db.getUsers()
    const users = fullUsers.map(({ username, id }) => {return { username, id }})
    res.json({ users })
}

const getUser = async (req, res, next) => {
    const user = await db.getUserById(req.params.userID)
    
    // Removing sensitive properties
    delete user["hash"]
    delete user["salt"]
    delete user["tokens"]

    res.json({ user })
}

const deleteUser = async (req, res, next) => {
    const userToRemove = req.params.userID

    if (userToRemove === req.user.id) {
        await db.deleteUser(userToRemove);
        res.send({ message: "User deleted" })
        activeUsers.notify({},activeUsers.USER)
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