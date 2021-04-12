const WebSocket = require('ws')
const controller = require('./pushnotify/controller')

module.exports = (server) => {
    const ws = new WebSocket.Server({ server })

    ws.on('connection', (conn) => {
        conn.on('message', (message) => {
            try {
                controller.handleMessage(conn, message)
            }
            catch (err) {
                conn.send("error")
                conn.close()
            }
        })
    })

    return ws
}