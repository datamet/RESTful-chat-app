/**
 * Validator for rooms
 */

const error = require('../../../lib/error')

const validator = {}

// Validates room name
validator.name = (name) => {
    if (!name) throw error.missing()
    const string = typeof name === 'string'
    const length = name.length >= 3
    if (!string) throw error.invalid()
    if (!length) throw error.custom(403, "Room name must be 3 characters or longer")
    return name
}

// Checks if user is admin of room
validator.admin = (user, roomID) => {
    if (user.ownedRooms.indexOf(roomID) !== -1) return user
    throw error.unauthorized()
}

// Checks if user is admin of room
validator.user = (user, roomID) => {
    if (user.rooms.indexOf(roomID) !== -1) return user
    throw error.unauthorized()
}

module.exports = validator