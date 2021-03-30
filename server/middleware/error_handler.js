const error_handler = (err, req, res, next) => {
    res.status(err.status ? err.status : 500).send(err.message)
}

module.exports = error_handler