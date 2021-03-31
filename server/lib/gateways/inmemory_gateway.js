/**
 * Implementation of gateway where inmemory stores are used
 */

const error = require('../error')
const { uuid } = require('../helpers')
const Gateway = require("./gateway")

// In memory stores
const users = new Map()
const tokens = new Map()
const rooms = new Map()

class InMemoryGateway extends Gateway {

    constructor() {
        super()
    }

    createUser(username, hash, salt) {
        // Check if username is unique
        if (users.has(username)) throw error.exists()

        // Creating user object
        const newUser = {
            username,
            hash,
            salt
        }

        // Adding user to user store
        users.set(username, newUser)
    }

    getUsers() {
        const usersList = { "users" : [] }
        for (const [username, user] of users) {
            delete user["hash"]
            delete user["salt"]
            usersList["users"].push(user)
        }
        return usersList
    }

    getUser(username){
        if (users.has(username)) return username

        throw error.notfound();
    }

    deleteUser(username) {
        for (const [tokenID, token] of tokens) {
            if (token.username === username) tokens.delete(tokenID)
        }
        
        users.delete(username)
    }

    getUserByName(username) {
        const user = users.get(username)
        if (user) return user
        else throw error.notfound()
    }

    storeToken({ id, username, expires}) {
        tokens.set(id, {username, expires})
    }

    getTokenById(id) {
        const token = tokens.get(id)
        if (token) return token
        else throw error.custom(404, "Session not found")
    }

    deleteToken(id) {
        tokens.delete(id)
    }

    createRoom(name, admin) {
        const roomID = uuid()

        const newRoom = {
            id: roomID,
            name,
            admin
        }

        rooms.set(roomID, newRoom)

        const adminUser = this.getUserByName(admin)
        const ownedRooms = adminUser.ownedRooms ? adminUser.ownedRooms : []
        ownedRooms.push(roomID)
        adminUser.ownedRooms = ownedRooms
        users.set(admin, adminUser)
        this.addRoomToUser(roomID, admin)
    }

    getRoomById(roomID) {
        const room = roooms.get(roomID)
        if (room) return room
        else throw error.custom(404, "Room not found") 
    }

    getRooms() {
        const roomList = { "rooms" : [] }
        for (const [roomId, room] of rooms) {
            roomList["rooms"].push(room)
        }
        return roomList
    }

    addUserToRoom(roomID, username) {
        const room = this.getRoomById(roomID)
        const users = room.users ? room.users : []
        users.push(username)
        room.users = users
        rooms.set(roomID, room)
    }

    addRoomToUser(roomID, username) {
        const user = this.getUserByName(username)
        const rooms = user.rooms ? user.rooms : []
        rooms.push(roomID)
        user.rooms = rooms
        users.set(username, user)
    }

}

// Exporting an instance of InMemoryGateway
module.exports = InMemoryGateway