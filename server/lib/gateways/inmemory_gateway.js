/**
 * Implementation of gateway where inmemory stores are used
 */

const error = require('../error')
const { uuid } = require('../helpers')
const Gateway = require("./gateway")

// In memory stores
const users = new Map()
const tokens = new Map()

class InMemoryGateway extends Gateway {

    constructor() {
        super()
    }

    createUser(name, hash, salt) {
        // Check if username is unique
        if (users.has(name)) throw error.exists()

        // Creating user object
        const newUser = {
            hash,
            salt
        }

        // Adding user to user store
        users.set(name, newUser)
    }

    getUsers() {
        const usersList = { "users" : [] }
        for (const [username, user] of users) {
            usersList["users"].push({ "username": username })
        }
        return usersList
    }

    getUser(username){
        if (users.has(username)) return username

        throw error.notfound();
    }

    deleteUser(username) {
        for (const [tokenID, token] of tokens) {
            if (token.username === username) tokens.delete(tokenID)
        }
        
        users.delete(username)
    }

    getUserByName(username) {
        const user = users.get(username)
        if (user) return user
        else throw error.notfound()
    }

    storeToken({ id, username, expires}) {
        tokens.set(id, {username, expires})
    }

    getTokenById(id) {
        const token = tokens.get(id)
        if (token) return token
        else throw error.notfound()
    }

}

// Exporting an instance of InMemoryGateway
module.exports = InMemoryGateway