const tokenValidator = require('../lib/validation/token_validator')
const db = require('../lib/gateways/db')

const auth_handler = (req, res, next) => {
    try {
        if ((req.path === '/api/users' || req.path === '/api/tokens') && req.method === 'POST') {
            next()
            return
        }
    
        const tokenID = tokenValidator.tokenID(req.header('Token'))
        const token = db.getTokenById(tokenID)
        tokenValidator.valid(token)
        req.user = token.username
        next()
    }
    catch (err) {
        next(err)
    }
}

module.exports = auth_handler