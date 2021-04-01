/**
 * Implementation of gateway where the file system is used
 */

 const Gateway = require("./gateway")

 class FSGateway extends Gateway {

    constructor() {
        super()
    }

 }

module.exports = FSGateway