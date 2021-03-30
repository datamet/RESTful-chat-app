/**
 * Implementation of gateway where an inmemory store is used
 */

const users = []

 const Gateway = require("./gateway")

 class InMemoryGateway extends Gateway {

    constructor() {
        super()
    }

    createUser(username, hash, salt) {
        for (user of users) {
            if (user.username === username) throw new Error("A user with that username already exists")
        }

        users.push({
            username,
            hash,
            salt
        })
    }

 }

module.exports = new InMemoryGateway()