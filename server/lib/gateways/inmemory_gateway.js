/**
 * Implementation of gateway where an inmemory store is used
 */

const error = require('../error') 

const users = []

const Gateway = require("./gateway")

class InMemoryGateway extends Gateway {

    constructor() {
        super()
    }

    createUser(username, hash, salt) {
        // Check if username is unique
        for (const user of users) {
            if (user.username === username) throw error.exists()
        }

        users.push({
            username,
            hash,
            salt
        })
    }

 }

module.exports = new InMemoryGateway()