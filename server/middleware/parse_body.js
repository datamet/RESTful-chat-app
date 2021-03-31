const parse_body = (req, res, next) => {
    data = "";
    req.on('data', (chunk) => data += chunk)
    req.on('end', () => {
        req.rawBody = data;
       
        if (req.is('application/json')) {
            try {
                req.body = data ? JSON.parse(data) : {}
                next()
            }
            catch (err) {
                next(err)
            }
            return
        }
        req.body = {}
        next()
    })
}

module.exports = parse_body