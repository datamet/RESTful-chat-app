/**
 * Client core
 * 
 * This is an implementation inspired by express.
 * The req, res, next middleware handeling is applied to each request.
 */

const createRequest = middleware => (request) => {
    // Request object
    const req = {
        path: request.path || '/',
        method: request.method || 'GET',
        headers: request.headers || {},
        body: request.body || {}
    }
    // middleware to use
    const tasks = [...middleware]

    const promise = new Promise((resolve, reject) => {
        // Response object
        const res = {
            status: 200,
            body: {},
            err: (reason) => {
                reject(reason)
            },
            end: () => {
                resolve({ status: res.status, body: res.body })
            }
        }
        
        // Recursive callback structure that calls every middleware with req, res and next
        const next = (err) => {
            if (!err) {
                const task = tasks.shift()
                if (task) task(req, res, next)
            }
        }

        next()
    })

    return promise
}

export default () => {
    const middleware = []
    const request = createRequest(middleware)

    // Exposes post, get, put and delete methods
    return {
        use: (func) => middleware.push(func),
        post: (path, obj) => request({path, method: 'POST', ...obj}),
        get: (path, obj) => request({path, method: 'GET', ...obj}),
        put: (path, obj) => request({path, method: 'PUT', ...obj}),
        delete: (path, obj) => request({path, method: 'DELETE', ...obj})
    }
}