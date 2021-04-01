/**
 * Chatroom controller
 */

// Imports
const db = require('../../../lib/gateways/db')
const error = require('../../../lib/error')
const roomValidator = require('./validator')

const createRoom = async (req, res, next) => {
    const name = roomValidator.name(req.body.name)
    const admin = req.user.id

    db.createRoom(name, admin)
    res.send({ "message" : "Room created" })
}

const getRooms = async (req, res, next) => {
    const rooms = db.getRooms()
    const reducedRooms = rooms.map(room => { return { "id" : room.id, "name" : room.name } })
    const jsonRooms = { "rooms" : reducedRooms }
    res.json(jsonRooms)
}

const getRoom = async (req, res, next) => {
    const room = db.getRoomById(req.params.roomID)
    const jsonRoom = { "room" : room }
    res.json(jsonRoom)
}

const deleteRoom = async (req, res, next) => {
    const roomID = req.params.roomID
    roomValidator.admin(req.user, roomID)
    
    db.deleteRoom(roomID)
    res.json({ "message" : "Room deleted" })
}

const addUserToRoom = async (req, res, next) => {
    throw error.internal()
}

const getUsersInRoom = async (req, res, next) => {
    throw error.internal()
}

const getMessages = async (req, res, next) => {
    throw error.internal()
}

const postMessage = async (req, res, next) => {
    throw error.internal()
}

const getMessagesFromUser = async (req, res, next) => {
    throw error.internal()
}

module.exports = { 
    createRoom, 
    getRooms, 
    getRoom, 
    deleteRoom, 
    addUserToRoom, 
    getUsersInRoom, 
    getMessages, 
    postMessage, 
    getMessagesFromUser 
}