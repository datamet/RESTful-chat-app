const WebSocket = require('ws')

module.exports = (server) => {
    const ws = new WebSocket.Server({ server })

    const originIsAllowed = (origin) => {
        // put logic here to detect whether the specified origin is allowed.
        return true;
    }

    ws.on('connection', (conn) => {
        conn.on('message', (message) => {
            console.log(message)
            conn.send(`message was: ${message}`)
        })
    })

    return ws
}
