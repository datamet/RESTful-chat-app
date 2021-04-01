/**
 * Room routes
 */

const db = require('../../../lib/gateways/db')
const roomValidator = require('../../../lib/validation/room_validator')

// Creating sub-router
const { app, router } = require('../../../lib/router')('/rooms')

// Creating chat room
router.post('/', (req, res, next) => {
    try {
        const name = roomValidator.name(req.body.name)
        const admin = req.user

        db.createRoom(name, admin)
        res.send({ "message" : "Room created" })
    }
    catch (err) {
        next(err)
    }
})

// Returning all chat rooms
router.get('/', (req, res, next) => {
    try {
        const rooms = db.getRooms()
        const reducedRooms = rooms.map(room => { return { "id" : room.id, "name" : room.name } })
        const jsonRooms = { "rooms" : reducedRooms }
        res.json(jsonRooms)
    }
    catch (err)  {
        next(err)
    }
})

// Returning room
router.get('/:roomID', (req, res, next) => {
    try {
        const room = db.getRoomById(req.params.roomID)
        const jsonRoom = { "room" : room }
        res.json(jsonRoom)
    }
    catch (err) {
        next(err)
    }
})

// Deleting room
router.delete('/:roomID', (req, res, next) => {
    try {
        const roomID = req.params.roomID
        const user = db.getUserById(req.user)
        roomValidator.admin(user, roomID)
        
        db.deleteRoom(roomID)
        res.json({ "message" : "Room deleted" })
    }
    catch (err) {
        next(err)
    }
})

module.exports = app