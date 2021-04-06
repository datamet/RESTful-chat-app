/**
 * Authenticator
 * 
 * Responsible for adding token to header
 */

import state from '../lib/state.js'

export default (req, res, next) => {
    // Exception for create user and login route
    if ((req.path === '/api/users' || req.path === '/api/tokens') && req.method === 'POST') {
        next()
        return
    }

    const { token } = state.get()
    if (token && typeof token === 'string') req.headers['Token'] = token

    next()
}