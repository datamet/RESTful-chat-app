/**
 * Creating routers with custom prefix
 */

const express = require("express")

module.exports = (route, subrouters) => {
    // Check if there are any subroutes
    subrouters = subrouters instanceof Array ? subrouters : []

    const app = express()
    const router = express.Router()

    app.use(route, router)
    for (const subroute of subrouters) {
        router.use(subroute)
    }

    return { app, router }
}