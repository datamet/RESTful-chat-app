/**
 * Implementation of gateway where inmemory stores are used
 */

const error = require('../error')
const { uuid } = require('../helpers')
const Gateway = require("./gateway")

// In memory stores
const users = new Map()

class InMemoryGateway extends Gateway {

    constructor() {
        super()
    }

    createUser(name, hash, salt) {
        // Check if username is unique
        for (let [id, user] of users) {
            if (user.name === name) throw error.exists()
        }

        // Creating a user id
        const id = uuid()

        // Creating user object
        const newUser = {
            name,
            hash,
            salt
        }

        // Adding user to user store
        users.set(id, newUser)
        return id
    }

}

// Exporting an instance of InMemoryGateway
module.exports = InMemoryGateway