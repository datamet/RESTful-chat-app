const parse_body = (req, res, next) => {
    data = "";
    req.on('data', (chunk) => data += chunk)
    req.on('end', () => {
       req.rawBody = data;
       
        try {
            if (data) {
                console.log(data)
                req.body = JSON.parse(data);
                return
            }
            req.body = {}
            next()
        }
        catch (err) {
            next(err)
        }
   })
}

module.exports = parse_body