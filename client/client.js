/**
 * Client application
 * 
 * This application is created to be able run in both the browser and in nodejs
 */

// Imports
import endpoints from './api/endpoints.js'
import api from './lib/api.js'
import config from './lib/config.js'
import state from './lib/state.js'
import fresh from './lib/fresh.js'
import createws from './lib/ws.js'

import auth from './middleware/authenticator.js'
import contentType from './middleware/contentType.js'
import fetch from './middleware/fetch.js'
import responseHandler from './middleware/responseHandler.js'

export default (options, httpModule, socketModule) => {
    // Throws error if http module not specified and running in node
    if (!httpModule && config.env === 'node') throw new Error("Http module is required as input when running in node")
    
    // Adding passed in config options to config file
    if (typeof options === 'object') Object.assign(config, options)

    // Creating rest interactor
    const rest = api()

    // Telling what the rest interactor should use each time a request is sent
    rest.use(auth)
    rest.use(contentType)
    rest.use(fetch(config, httpModule))
    rest.use(responseHandler)

    // Creating socket socket connection for push notifications
    const ws = createws(`ws://${config.host}:${config.wsport}`, socketModule ? socketModule : null)

    // setting up server connecion with rest interactor
    const client = endpoints(rest)
    client.state = state
    client.fresh = fresh
    client.ws = ws

    return client
}