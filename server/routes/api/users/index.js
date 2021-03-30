/**
 * Users route
 */

const { app, router, gateway } = require('../../../lib/router')('/users')

router.get('/', (req, res) => {
    res.send("this is the users list")
})

module.exports = app