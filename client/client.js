/**
 * Client application
 * 
 * This application is created to be able run in both the browser and in nodejs
 * Exports a createClient function that when called returns a new client instance
 * 
 * The client is inspired by the way express handles requests. We have implemented
 * a similar req, res, next middleware approach
 */

// Imports
import endpoints from './api/endpoints.js'
import createCore from './lib/core.js'
import config from './lib/config.js'
import createState from './lib/state.js'
import createFresh from './lib/fresh.js'
import ws from './lib/ws.js'

import auth from './middleware/authenticator.js'
import contentType from './middleware/contentType.js'
import fetch from './middleware/fetch.js'
import responseHandler from './middleware/responseHandler.js'

const checkPush = async (client) => {
    // Check if server has push notifications enabled
    const res = await client.checkPush()

    // Starting refetch sycle if push notifications are disabled
    // by client or server
    if (res.body.push === 'disabled' || !config.push) client.fresh.start()
}

export default (options, httpModule, SocketModule) => {
    // Throws error if http module not specified and running in node
    if (!httpModule && config.env === 'node') throw new Error("Http module is required as input when running in node")
    
    // Adding passed in config options to config file
    if (typeof options === 'object') Object.assign(config, options)

    // Creating the client core. Responsible for funneling requests from start to response
    const core = createCore()

    // Creating state instance
    const state = createState()

    // Telling what the client core should use each time a request is sent
    core.use(auth(state))
    core.use(contentType)
    core.use(fetch(config, httpModule))
    core.use(responseHandler(state))

    // Setting up the endpoints with the client core
    const client = endpoints(core)
    
    // Appending state to client
    client.state = state

    // Appending fresh module (api for getting fresh data whenever there are changes on the server)
    client.fresh = createFresh()

    // Creating websocket url
    const wsURL = config.port ? `ws://${config.host}:${config.port}` : `ws://${config.host}`

    // Setting up websocket module and passing, client state and an update function from fresh.
    ws(wsURL, { SocketModule, update: client.fresh.update, state })

    // Check if push notifications are enabled on server
    checkPush(client)

    return client
}

