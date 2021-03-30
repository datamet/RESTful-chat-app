const error = {
    custom: (status, message) => {
        const err = new Error(message)
        err.status = status
        return err
    },
    exists: () => error.custom(409, "Resource already exists"),
    missing: () => error.custom(400, "Missing required fields"),
    notfound: () => error.custom(404, "Resource not found"),
    internal: () => error.custom(500, "Internal server error")
}

module.exports = error