/**
 * Fetching from server
 */

import environment from '../lib/config.js'

let config, http

// Uses the browsers built in fetch api
const browserFetch = async (req, res, next) => {
    try {
        const { path, method, headers, body } = req
        const url = config.port ? `http://${config.host}:${config.port}${path}` : `http://${config.host}${path}`
        const response = await fetch(url, {
            method, 
            headers, 
            body: method === 'POST' || method == 'PUT' ? JSON.stringify(body) : null
        })
        
        if (response.headers.get('Content-Type') === 'application/json; charset=utf-8') {
            const data = await response.json()
            res.status = response.status
            res.body = data
        }
        else {
            console.log(await response.text())
        }
        next()
    }
    catch(err) {
        res.status = 408
        res.body = { error: "Could not connect to the server" }
        next()
    }
}

// Uses the http module from the node api.
const nodeFetch = async (req, res, next) => {
    try {
        const { path, method, headers, body } = req
        const data = JSON.stringify(body)
        
        const options = {
            hostname: config.host,
            port: config.port,
            path,
            method,
            headers: {
                ...headers,
                'Content-Length': data.length
            }
        }
        
        const request = http.request(options, respons => {
            res.status = respons.statusCode
            
            let data = ''
            respons.on('data', d => {
                data += d
            })

            respons.on('end', () => {
                const body = JSON.parse(data)
                res.body = body
            
                next()
            })
        })
        
        request.on('error', error => {
            console.error(error)
        })
        
        request.write(data)
        request.end()
    }
    catch (err) {
        res.status = 408
        res.body = { error: "Could not connect to the server" }
        next()
    }
} 

// Returns function that uses the browsers built in fetch module if running in the browser,
// otherwise returns a function that takes node's http module as an argument to
// be able to send http requests via node's api.
// This had to be done because dynamic imports still are under development
export default environment.env === 'browser' ? (options) => { config = options ; return browserFetch} : (options, httpModule) => { 
    http = httpModule
    config = options
    return nodeFetch 
}