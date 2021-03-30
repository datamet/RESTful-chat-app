/**
 * Responsible for communicating with the storage implementation.
 * (In memory, database, etc...)
 */

const error = require('../error')

class Gateway {

    constructor() {

    }

    createUser() {
        throw error.internal()
    }

    getUsers() {
        throw error.internal()
    }

    deleteUser() {
        throw error.internal()
    }

}

module.exports = Gateway