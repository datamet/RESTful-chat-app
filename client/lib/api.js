/**
 * Api handler
 */

const middleware = []

const request = (request) => {
    const req = {
        path: request.path || '/',
        method: request.method || 'GET',
        headers: request.headers || {},
        body: request.body || {}
    }
    const tasks = [...middleware]
    const promise = new Promise((resolve, reject) => {
        const res = {
            status: 200,
            body: {},
            err: () => {
                reject()
            },
            end: () => {
                resolve({ status: res.status, body: res.body })
            }
        }
        
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
    return {
        use: (func) => middleware.push(func),
        post: (path, obj) => request({path, method: 'POST', ...obj}),
        get: (path, obj) => request({path, method: 'GET', ...obj}),
        put: (path, obj) => request({path, method: 'PUT', ...obj}),
        delete: (path, obj) => request({path, method: 'DELETE', ...obj})
    }
}