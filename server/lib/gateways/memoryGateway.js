/**
 * Implementation of gateway where inmemory stores are used
 */

const error = require('../error')
const { uuid } = require('../auth')
const Gateway = require("./gateway")

// In memory stores
const userIDs = new Map()
const users = new Map()
const tokens = new Map()
const rooms = new Map()

class InMemoryGateway extends Gateway {

    constructor() {
        super()
    }

    createUser(username, hash, salt) {
        // Check if username is unique
        if (userIDs.has(username)) throw error.custom(409, "User already exists")

        const userID = uuid()

        // Creating user object
        const newUser = {
            id: userID,
            username,
            hash,
            salt
        }

        // Adding user to user store
        userIDs.set(username, userID)
        users.set(userID, newUser)
        return userID
    }

    getUsers() {
        const usersList = []
        for (const [userID, user] of users) {
            usersList.push(user)
        }
        return usersList
    }

    getUserByName(username){
        const userID = userIDs.get(username)
        if (userID) {
            const user = users.get(userID)

            if(user) {
                return user
            }
        }

        throw error.notfound();
    }

    getUserById(userID) {
        const user = users.get(userID)
        if (user) {
            return user
        }
        else throw error.notfound()
    }

    deleteUser(userID) {
        const user = this.getUserById(userID)
        for (const tokenID of user.tokens) {
            tokens.delete(tokenID)
        }
        
        userIDs.delete(user.username)
        users.delete(userID)
    }

    storeToken(token) {
        tokens.set(token.id, token)
        
        const user = this.getUserById(token.userID)
        const userTokens = user.tokens ? user.tokens : []
        userTokens.push(token.id)
        user.tokens = userTokens
        users.set(token.userID, user)
    }

    getTokenById(id) {
        const token = tokens.get(id)
        if (token) return token
        else throw error.custom(404, "Session not found")
    }

    deleteToken(tokenID) {
        const token = this.getTokenById(tokenID)

        if (token) {
            const user = this.getUserById(token.userID)
            if (user) {
                const i = user.tokens.indexOf(tokenID)
                user.tokens.splice(i, 1)
                users.set(token.userID, user)
            }
            tokens.delete(tokenID)
        }
    }

    createRoom(name, adminID) {
        const roomID = uuid()

        const newRoom = {
            id: roomID,
            name,
            admin: adminID,
            users: [adminID]
        }

        rooms.set(roomID, newRoom)

        const adminUser = this.getUserById(adminID)
        const ownedRooms = adminUser.ownedRooms ? adminUser.ownedRooms : []
        ownedRooms.push(roomID)
        adminUser.ownedRooms = ownedRooms
        users.set(adminID, adminUser)
        this.addRoomToUser(roomID, adminID)
    }

    getRoomById(roomID) {
        const room = rooms.get(roomID)
        if (room) return room
        else throw error.custom(404, "Room not found") 
    }

    getRooms() {
        const roomList = []
        for (const [roomId, room] of rooms) {
            roomList.push(room)
        }
        return roomList
    }

    deleteRoom(roomID) {
        const room = rooms.get(roomID)

        if (room) {
            // delete roomID from admin
            const admin = this.getUserById(room.admin)
            const i = admin.ownedRooms.indexOf(roomID)
            admin.ownedRooms.splice(i, 1)
            users.set(room.admin, admin)

            // delete roomID from users
            for (const userID of room.users) {
                const user = this.getUserById(userID)
                const i = user.rooms.indexOf(roomID)
                user.rooms.splice(i, 1)
                users.set(userID, user)
            }

            // delete room
            rooms.delete(roomID)
            return           
        }
        throw error.notfound()
    }

    addUserToRoom(roomID, userID) {
        const room = this.getRoomById(roomID)
        const users = room.users ? room.users : []
        users.push(userID)
        room.users = users
        rooms.set(roomID, room)
    }

    addRoomToUser(roomID, userID) {
        const user = this.getUserById(userID)
        const rooms = user.rooms ? user.rooms : []
        rooms.push(roomID)
        user.rooms = rooms
        users.set(userID, user)
    }

}

module.exports = InMemoryGateway