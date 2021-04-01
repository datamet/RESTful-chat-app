const tokenValidator = require('../lib/validation/token_validator')
const db = require('../lib/gateways/db')

// Runs on evevery request to check if the user is authenticated
const auth_handler = async (req, res, next) => {
    try {
        // Exception for create user and login route
        if ((req.path === '/api/users' || req.path === '/api/tokens') && req.method === 'POST') {
            next()
            return
        }
        
        // Validates token and adds user id to request for ease of use
        const tokenID = tokenValidator.tokenID(req.header('Token'))
        const token = await db.getTokenById(tokenID)
        tokenValidator.valid(token)
        
        const user = await db.getUserById(token.userID)
        req.user = user
        next()
    }
    catch (err) {
        // Throws error if user is not authenticated
        next(err)
    }
}

module.exports = auth_handler