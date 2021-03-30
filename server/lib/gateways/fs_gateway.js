/**
 * Implementation of gateway where an inmemory store is used
 */

 const Gateway = require("./gateway")

 class FSGateway extends Gateway {

    constructor() {
        super()
    }

    doSomething() {
        console.log("doing something else")
    }

 }

module.exports = new FSGateway()