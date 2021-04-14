/**
 * Respons handler
 * 
 * Responsible for handeling responses and updating state based on
 * responses from the server
 */

export default state => (req, res, next) => {
    if (res.body.token && typeof res.body.token === 'string') state.update({ token: res.body.token })
    if (res.body.message && res.body.message === 'Logged out') state.update({ token: null, userID: null })
    if (res.body.message && res.body.message === 'User deleted') state.update({ token: null, userID: null })
    if (res.body.error && res.body.error === 'Session not found') state.update({ token: null, userID: null })
    if (res.body.userID && typeof res.body.userID === 'string') state.update({ userID: res.body.userID })

    res.end()
}