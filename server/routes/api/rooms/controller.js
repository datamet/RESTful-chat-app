/**
 * Chatroom controller
 */

// Imports
const db = require('../../../lib/db')
const error = require('../../../lib/error')
const validator = require('./validator')

const createRoom = async (req, res, next) => {
    const name = validator.name(req.body.name)
    const admin = req.user.id

    await db.createRoom(name, admin)
    res.send({ message: "Room created" })
}

const getRooms = async (req, res, next) => {
    const rooms = await db.getRooms()
    const reducedRooms = rooms.map(({ id, name }) => { return { id, name } })
    res.json({ rooms: reducedRooms })
}

const getRoom = async (req, res, next) => {
    const room = await db.getRoomById(req.params.roomID)
    res.json({ room })
}

const deleteRoom = async (req, res, next) => {
    const roomID = req.params.roomID
    validator.admin(req.user, roomID)
    
    await db.deleteRoom(roomID)
    res.json({ message: "Room deleted" })
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