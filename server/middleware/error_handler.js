const { debug } = require('../lib/config')

const error_handler = (err, req, res, next) => {
    const status = err.status ? err.status : 500
    if (debug) {
        console.log(`[ERROR] ${status} : ${err.message}`)
        console.log(`[TRACEBACK]`)
        console.log(err.stack)
    }
    res.status(status).send(err.message)
}

module.exports = error_handler