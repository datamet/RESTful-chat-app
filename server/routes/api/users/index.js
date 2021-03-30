/**
 * Users routes
 */

const express = require("express")
const app = module.exports = express()

app.get("/users", (req, res) => {
    res.send("user list")
})
