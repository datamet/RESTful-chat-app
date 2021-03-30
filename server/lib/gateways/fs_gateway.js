/**
 * Implementation of gateway where the file system is used
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

module.exports = FSGateway