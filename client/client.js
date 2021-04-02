/**
 * Client application
 */

// Imports
import endpoints from './api/endpoints.js'
import api from './lib/api.js'
import config from './lib/config.js'
import state from './lib/config'

import auth from './middleware/authenticator.js'
import contentType from './middleware/contentType.js'
import fetch from './middleware/fetch.js'
import responseHandler from './middleware/responseHandler.js'

export default (httpModule) => {
    // Throws error if http module not specified and running in node
    if (!httpModule && config.env === 'node') throw new Error("Http module is required as input when running in node")

    // Creating rest interactor
    const rest = api()

    // Telling what the rest interactor should use each time a request is sent
    rest.use(auth)
    rest.use(contentType)
    rest.use(fetch(httpModule))
    rest.use(responseHandler)

    // setting up server connecion with rest interactor
    const client = endpoints(rest)
    client.state = state

    return client
}