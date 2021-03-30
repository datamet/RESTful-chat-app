/**
 * Responsible for communicating with the storage implementation.
 * (In memory, database, etc...)
 */

class Gateway {

    constructor() {

    }

    createUser() {
        throw new Error("No implementation for createUser")
    }

}

module.exports = Gateway