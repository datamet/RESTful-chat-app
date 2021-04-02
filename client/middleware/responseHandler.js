/**
 * Respons handler
 * 
 * Responsible for handeling responses
 */

import state from '../lib/state.js'

export default (req, res, next) => {
    if (res.body.token && typeof res.body.token === 'string') state.update({ token: res.body.token })

    res.end()
}