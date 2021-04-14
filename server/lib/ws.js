const WebSocket = require('ws')
const controller = require('./pushnotify/controller')

// Creates websocket and attaches the server to it
module.exports = (server) => {
    const ws = new WebSocket.Server({ server })

    ws.on('connection', (conn) => {
        conn.on('message', (message) => {
            try {
                // handle initial message with token from client
                controller.handleMessage(conn, message)
            }
            catch (err) {
                // Closing connection if token is invalid
                conn.send("error")
                conn.close()
            }
        })
    })

    return ws
}