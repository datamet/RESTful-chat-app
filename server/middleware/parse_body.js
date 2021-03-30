const parse_body = (req, res, next) => {
    data = "";
    req.on('data', (chunk) => data += chunk)
    req.on('end', () => {
       req.rawBody = data;
       
        try {
            req.body = data ? JSON.parse(data) : {}
            next()
        }
        catch (err) {
            next(err)
        }
   })
}

module.exports = parse_body