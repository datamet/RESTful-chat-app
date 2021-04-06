/**
 * Api endpoints
 */

// Imports
const users = require('./users/controller')
const tokens = require('./tokens/controller')
const rooms = require('./rooms/controller')

const { app, router } = require('../../lib/router')('/api')

// We have to wrap everything in try/catch here because
// express does not support promise rejections on it's own yet
const catcher = (func) => {
    return async (req, res, next) => {
        try { 
            await func(req, res, next)
        }
        catch(err) {
            next(err)
        } 
    }
}

// User routes
router.post('/users', catcher(users.createUser))
router.get('/users', catcher(users.getUsers))
router.get('/user/:userID', catcher(users.getUser))
router.delete('/user/:userID', catcher(users.deleteUser))

// Token routes
router.post('/tokens', catcher(tokens.createToken))
router.get('/token/:tokenID', catcher(tokens.getToken))
router.put('/token/:tokenID', catcher(tokens.extendToken))
router.delete('/token/:tokenID', catcher(tokens.deleteToken))

// Chatroom routes
router.post('/rooms', catcher(rooms.createRoom))
router.get('/rooms', catcher(rooms.getRooms))
router.get('/room/:roomID', catcher(rooms.getRoom))
router.delete('/room/:roomID', catcher(rooms.deleteRoom))

router.post('/room/:roomID/users', catcher(rooms.addUserToRoom))
router.get('/room/:roomID/users', catcher(rooms.getUsersInRoom))

router.get('/room/:roomID/messages', catcher(rooms.getMessages))
router.post('/room/:roomID/:userID/messages', catcher(rooms.postMessage))
router.get('/room/:roomID/:userID/messages', catcher(rooms.getMessagesFromUser))

module.exports = app