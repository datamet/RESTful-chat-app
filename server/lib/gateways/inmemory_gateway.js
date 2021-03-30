/**
 * Implementation of gateway where an inmemory store is used
 */

 const Gateway = require("./gateway")

 class InMemoryGateway extends Gateway {

    constructor() {
        super()
    }

    doSomething() {
        console.log("doing something")
    }

 }

module.exports = new InMemoryGateway()