const { debug } = require('../lib/config')

const error_handler = (err, req, res, next) => {
    const status = err.status ? err.status : 500
    if (debug) {
        console.error(`[ERROR] ${status} : ${err.message}`)
        console.error(`[TRACEBACK]`)
        console.error(err.stack)
    }
    res.status(status).send(status === 500 ? "Internal server error" : err.message)
}

module.exports = error_handler