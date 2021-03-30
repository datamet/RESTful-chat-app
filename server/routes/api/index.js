/**
 * API routes
 */

const router = require('../../lib/router')('/api')

// // Importing routes
// const users = require('./users')

// // Using routes
// router.use(users)

router.router.get('/',(req, res) => {
    res.send("hi from api")
})

module.exports = router.app