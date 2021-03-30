/**
 * API routes
 */

const express = require("express")
const app = module.exports = express()
const router = express.Router()

// Importing routes
const users = require("./users")

// Using routes
app.use('/api', router)
router.use(users)