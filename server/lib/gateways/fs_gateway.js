/**
 * Implementation of gateway where the file system is used
 */

 const Gateway = require("./gateway")

 class FSGateway extends Gateway {

    constructor() {
        super()
    }

    createUser(username, hash, salt) {
        throw error.internal()
    }

    getUsers() {
        throw error.internal()
    }

    getUserByName(username){
        throw error.internal()
    }

    getUserById(userID) {
        throw error.internal()
    }

    deleteUser(userID) {
        throw error.internal()
    }

    storeToken(token) {
        throw error.internal()
    }

    getTokenById(id) {
        throw error.internal()
    }

    deleteToken(tokenID) {
        throw error.internal()
    }

    createRoom(name, adminID) {
        throw error.internal()
    }

    getRoomById(roomID) {
        throw error.internal()
    }

    getRooms() {
        throw error.internal()
    }

    deleteRoom(roomID) {
        throw error.internal()
    }

    addUserToRoom(roomID, userID) {
        throw error.internal()
    }

    addRoomToUser(roomID, userID) {
        throw error.internal()
    }

 }

module.exports = FSGateway