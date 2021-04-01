/**
 * Room routes
 */

const db = require('../../../lib/gateways/db')
const roomValidator = require('../../../lib/validation/room_validator')

// Importing subroutes

// Creating sub-router
const { app, router } = require('../../../lib/router')('/rooms')

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

router.get('/', (req, res, next) => {
    try {
        const rooms = db.getRooms()
        const jsonRooms = { "rooms" : rooms }
        res.json(jsonRooms)
    }
    catch (err)  {
        next(err)
    }
})

router.get('/:roomID', (req, res, next) => {
    try {
        const room = db.getRoomById(req.params.roomID)
        res.json(room)
    }
    catch (err) {
        next(err)
    }
})

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