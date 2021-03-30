/**
 * Users route
 */

const router = require('../../../lib/router')('/users')

router.get('/', (req, res) => {
    res.send("this is the users list")
})

module.exports = router