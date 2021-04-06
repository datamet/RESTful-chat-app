/**
 * Content Type
 * 
 * Responsible for adding content type to header
 */

export default (req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT') req.headers['Content-Type'] = 'application/json'
    next()
}