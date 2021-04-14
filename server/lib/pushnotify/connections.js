/**
 * Stores active connections
 * Exposes methods to store and notify all acitve connections
 */

const conns = new Map()
const db = require('../db.js')

module.exports = {
    MESSAGE: '!message',
    USER: '!user',
    ROOM: '!room',
    remove: (client) => {
        for (const [userID, conn] of conns) {
            if (client === conn) {
                conns.delete(userID)
                break
            }
        }
    },
    add: (userID, client) => conns.set(userID, client),
    notify: async ({ roomID, userID }, notification) => {
        let clientsToNotify
        if (roomID) clientsToNotify = await db.getUsersInRoom(roomID).map(({ id }) => id)
        else if (userID) clientsToNotify = [userID]
        else clientsToNotify = [ ...conns.keys() ]

        clientsToNotify.map(userID => {
            if (conns.has(userID)) {
                const conn = conns.get(userID)
                conn.send(notification)
            }
        })
    }
}