/**
 * Fetching from server
 */

// Imports
import config from '../lib/config.js'
import fetch from 'node-fetch'

const { host, port } = config

export default async (req, res, next) => {
    const { path, method, headers, body } = req
    const response = await fetch(`http://${host}:${port}${path}`, {
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
        console.log("[ERROR] something went wrong")
        console.log(await response.text())
    }
    next()
}