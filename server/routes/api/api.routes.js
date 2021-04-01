/**
 * Api endpoints
 */

// Imports
const users = require('./users/controller')
const tokens = require('./tokens/controller')
const rooms = require('./rooms/controller')

const { app, router } = require('../../lib/router')('/api')

// User routes
router.post('/users', users.createUser)
router.get('/users', users.getUsers)
router.get('/user/:userID', users.getUser)
router.delete('/user/:userID', users.deleteUser)

// Token routes
router.post('/tokens', tokens.createToken)
router.get('/token/:tokenID', tokens.getToken)
router.put('/token/:tokenID', tokens.extendToken)
router.delete('/token/:tokenID', tokens.deleteToken)

// Chatroom routes
router.post('/rooms', rooms.createRoom)
router.get('/rooms', rooms.getRooms)
router.get('/room/:roomID', rooms.getRoom)
router.delete('/room/:roomID', rooms.deleteRoom)

router.post('/room/:roomID/users', rooms.addUserToRoom)
router.get('/room/:roomID/users', rooms.getUsersInRoom)

router.get('/room/:roomID/messages', rooms.getMessages)
router.post('/room/:roomID/:userID/messages', rooms.postMessage)
router.get('/room/:roomID/:userID/messages', rooms.getMessagesFromUser)

module.exports = app