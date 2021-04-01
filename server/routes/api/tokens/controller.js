/**
 * User controller
 */

// Imports
const db = require('../../../lib/db')
const error = require('../../../lib/error')
const validator = require('./validator')
const auth = require('../../../lib/auth')

const createToken = async (req, res, next) => {
    const username = typeof req.body.username === 'string' ? req.body.username : ""
    const password = typeof req.body.password === 'string' ? req.body.password : ""

    let user
    // Checking if user exists
    try {
        user = await db.getUserByName(username)
    }
    catch (err) {
        next(error.credentials())
        return
    }
    const passwordHash = auth.hash(password + user.salt)

    // Checking if password matches
    if (user.hash === passwordHash) {
        const token = auth.createToken(user.id)
        await db.storeToken(token)
        res.json({ 
            "token" : token.id,
            "message" : "Logged in"
        })
        return
    }
    next(error.credentials())
}

const getToken = async (req, res, next) => {
    const tokenID = validator.tokenID(req.params.tokenID)
    const token = await db.getTokenById(tokenID)
    const jsonToken = { "token" : token }
    res.json(jsonToken)
}

const extendToken = async (req, res, next) => {
    const tokenID = validator.tokenID(req.params.tokenID)

    const token = validator.valid(await db.getTokenById(tokenID))
    
    // Extending token expiration date
    const extendedToken = auth.extendToken(token)
    await db.updateToken(extendedToken)
    res.json({ "message" : "Session extended" })
}

const deleteToken = async (req, res, next) => {
    const tokenID = validator.tokenID(req.params.tokenID)
    await db.deleteToken(tokenID)
    res.send({ "message" : "Logged out"})
}

module.exports = { 
    createToken, 
    getToken, 
    extendToken, 
    deleteToken 
}