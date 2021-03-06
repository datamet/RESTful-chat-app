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

    createUser(username, hash, salt, bot) {
        // Check if username is unique
        if (userIDs.has(username)) throw error.custom(409, "User already exists")

        const userID = uuid()

        // Creating user object
        const newUser = {
            id: userID,
            username,
            hash,
            salt,
            bot
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

    getUserByName(username) {
        const userID = userIDs.get(username)
        if (userID) {
            const user = users.get(userID)

            if (user) {
                return user
            }
        }

        throw error.notfound();
    }

    getUserById(userID) {
        const user = users.get(userID)
        if (user) {
            return {...user}
        }
        else throw error.notfound()
    }

    deleteUser(userID) {
        const user = this.getUserById(userID)
        for (const tokenID of user.tokens) {
            tokens.delete(tokenID)
        }

        for (const room of user.rooms) {
            this.removeUserFromRoom(room, userID)
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

    updateToken(token) {
        tokens.set(token.id, token)
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
        for (const [roomID, room] of rooms) {
            if (room.name === name) throw error.custom(409, "A room with that name allready exists")
        }

        const newRoom = {
            id: roomID,
            name,
            admin: adminID,
            users: [adminID],
            messages: []
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

    removeUserFromRoom(roomID, userID) {
        const room = rooms.get(roomID)
        if (room.admin === userID) this.deleteRoom(roomID)
        else room.users.splice(room.users.indexOf(userID), 1)
    }

    getUsersInRoom(roomID) {
        const userIDs = rooms.get(roomID).users
        return userIDs
                    .map(id => this.getUserById(id))
                    .map(user => { return { id: user.id, username: user.username, bot: user.bot } })
    }

    postMessage(sender, roomID, message){
        const room = rooms.get(roomID)
        const new_message = {
            sender,
            message
        }
        room.messages.push(new_message);
    }

    getMessages(roomID){
        return rooms.get(roomID).messages;
    }

    getMessagesFromUser(roomID, userID){
        const messages = this.getMessages(roomID);
        return messages.filter(msg => msg.sender === this.getUserById(userID).username ? true : false)
    }

}

module.exports = InMemoryGateway