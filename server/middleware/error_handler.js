const { debug } = require('../lib/config')

const error_handler = (err, req, res, next) => {
    const status = err.status ? err.status : 500
    if (debug) {
        console.error(`[ERROR] ${status} : ${err.message}`)
        console.error(`[TRACEBACK]`)
        console.error(err.stack)
    }
    const errorMessage = status === 500 ? "Internal server error" : err.message
    res.status(status).json({ "error" : errorMessage })
}

module.exports = error_handler