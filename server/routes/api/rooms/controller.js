/**
 * Chatroom controller
 */

// Imports
const db = require('../../../lib/db')
const error = require('../../../lib/error')
const validator = require('./validator')
const activeUsers = require('../../../lib/pushnotify/connections')

const createRoom = async (req, res, next) => {
    const name = validator.name(req.body.name)
    const admin = req.user.id

    await db.createRoom(name, admin)

    activeUsers.notify({}, activeUsers.ROOM)
    res.send({ message: "Room created" })
}

const getRooms = async (req, res, next) => {
    const rooms = await db.getRooms()
    const reducedRooms = rooms.map(({ id, name, users }) => {
        let joined = false
        if (users.indexOf(req.user.id) > -1) joined = true
        return { id, name, joined }
    })
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
    activeUsers.notify({},activeUsers.ROOM)
    res.json({ message: "Room deleted" })
}

const addUserToRoom = async (req, res, next) => {
    await db.addUserToRoom(req.params.roomID, req.body.user)
    await db.addRoomToUser(req.params.roomID, req.body.user)

    activeUsers.notify({roomID: req.params.roomID}, activeUsers.USER)
    res.json({ message: "Added user to room" })
}

const getUsersInRoom = async (req, res, next) => {
    validator.user(req.user, req.params.roomID)
    const users = await db.getUsersInRoom(req.params.roomID)
    res.json({ users })
}

const postMessage = async (req, res, next) => {
    validator.user(req.user, req.params.roomID)
    await db.postMessage(req.user.username, req.params.roomID, req.body.message)
    activeUsers.notify({roomID: req.params.roomID}, activeUsers.MESSAGE)
    res.json({ message: "Message sent" })
}

const getMessages = async (req, res, next) => {
    validator.user(req.user, req.params.roomID)
    const messages = await db.getMessages(req.params.roomID)
    res.json({ messages })
}

const getMessagesFromUser = async (req, res, next) => {
    validator.user(req.user, req.params.roomID)
    const messages = await db.getMessagesFromUser(req.params.roomID, req.params.userID)
    res.json({ messages })
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