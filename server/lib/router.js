/**
 * Creating routers with custom prefix
 */

const express = require('express')
const gateway = require('./gateway')

module.exports = (route, subrouters) => {
    // Check if there are any subroutes
    subrouters = subrouters instanceof Array ? subrouters : []

    // Each router is it's own sub-application to make it more modular
    const app = express()
    const router = express.Router()

    app.use(route, router)
    for (const subroute of subrouters) {
        router.use(subroute)
    }

    return { app, router, gateway }
}