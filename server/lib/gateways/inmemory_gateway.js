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

        /*
        const object = {}

        users.forEach((value, key) => {
            var keys = key.split('.'),
                last = keys.pop();
            keys.reduce((r, a) => r[a] = r[a] || {}, object)[last] = value;
        });

        return object
        */

        /*
        return users
        */

        return JSON.parse(users)
    }

    deleteUser(token, user_id) {
        tokens.forEach(key => {
            if(key === token) tokens.delete(key)
        });
        
        users.forEach(user => {
            if(user === user_id) users.delete(user)
        });
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