/**
 * Responsible for communicating with the storage implementation.
 * (In memory, database, etc...)
 */

class Gateway {

    constructor() {

    }

    createUser(username, password) {
        throw new Error("No implementation for createUser")
    }

}

module.exports = Gateway