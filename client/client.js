/**
 * Client application
 * 
 * This application is created to be able run in both the browser and in nodejs
 */

// Imports
import endpoints from './api/endpoints.js'
import api from './lib/api.js'
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

    // Creating rest interactor
    const rest = api()

    // Creating state instance
    const state = createState()

    // Telling what the rest interactor should use each time a request is sent
    rest.use(auth(state))
    rest.use(contentType)
    rest.use(fetch(config, httpModule))
    rest.use(responseHandler(state))

    // Setting up server connecion with rest interactor
    const client = endpoints(rest)
    
    // Appending modules to client
    client.state = state
    client.fresh = createFresh()

    // Setup websocket connection
    const wsURL = config.port ? `ws://${config.host}:${config.port}` : `ws://${config.host}`
    ws(wsURL, { SocketModule, update: client.fresh.update, state })

    // Check if push notifications is enabled on server
    checkPush(client)

    return client
}

