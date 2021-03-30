/**
 * Implementation of gateway where an inmemory store is used
 */

 const Gateway = require("./gateway")

 class FSGateway extends Gateway {

    constructor() {
        super()
    }

    createUser() {
        console.log("creating user")
    }

 }

module.exports = new FSGateway()