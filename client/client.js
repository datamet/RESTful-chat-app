/**
 * Client application
 */

// Imports
import endpoints from './api/endpoints.js'
import api from './lib/api.js'

import auth from './middleware/authenticator.js'
import contentType from './middleware/contentType.js'
import fetch from './middleware/fetch.js'
import responseHandler from './middleware/responseHandler.js'

// Creating rest interactor
const rest = api()

// Telling what the rest interactor should use each time a request is sent
rest.use(auth)
rest.use(contentType)
rest.use(fetch)
rest.use(responseHandler)

// setting up server connecion with rest interactor
const client = endpoints(rest)

export default client