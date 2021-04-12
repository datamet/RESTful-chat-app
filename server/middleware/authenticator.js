const validator = require('../routes/api/tokens/validator')
const db = require('../lib/db')

// Runs on evevery request to check if the user is authenticated
const auth_handler = async (req, res, next) => {
    try {
        console.log(`[request] ${req.method} ${req.path}`)
        // Exception for all paths that are not to /api.
        if (req.path.lastIndexOf('/api', 0) === 0) {
            // Exception for /api/users, /api/tokens and /api/push
            if (((req.path === '/api/users' || req.path === '/api/tokens') && req.method === 'POST') || req.path === '/api/push') {
                next()
                return
            }
        }
        else {
            next()
            return
        }
        
        // Validates token and adds user id to request for ease of use
        const tokenID = validator.tokenID(req.header('Token'))
        const token = await db.getTokenById(tokenID)
        validator.valid(token)
        
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