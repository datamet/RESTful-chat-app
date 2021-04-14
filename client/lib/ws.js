import environment from './config.js'

// Browser implementation for websockets
const browserWS = (url, { update, state }) => {
    let ws
    let notify = update

    const createWebsocket = (url) => {
        const ws = new WebSocket(url)

        ws.onerror = (event) => {
            console.log(event)
            ws.close()
        }

        return ws
    }

    // Notifying all fresh subscribers of server update.
    const handleMessage = (event) => {
        notify()
    }

    // Subscribe to client state to get login and logout updates
    state.subscribe(({ token }) => {
        if (token && !ws) {
            // If logged in and websocket does not exist
            ws = createWebsocket(url)
            ws.onopen = () => ws.send(token)
            ws.onmessage = (event) => handleMessage(event)
        }
        else if (!token && ws) {
            // If logged out and websocket exists
            ws.close()
            ws = null
        }
    })
}

// Node implementation for websockets
const nodeWS = (url, { SocketModule, update, state }) => {
    let ws
    let notify = update

    const createWebsocket = (url, SocketModule) => {
        const ws = new SocketModule(url)

        ws.on('error', (event) => {
            console.log(event)
            ws.close()
        })

        return ws
    }

    // Notifying all fresh subscribers of server update.
    const handleMessage = (event) => {
        notify()
    }

    // Subscribe to client state to get login and logout updates
    state.subscribe(({ token }) => {
        if (token && !ws) {
            // If logged in and websocket does not exist
            ws = createWebsocket(url, SocketModule)
            ws.on('open', () => ws.send(token))
            ws.on('message', (event) => handleMessage(event))
        }
        else if (!token && ws) {
            // If logged out and websocket exists
            ws.close()
            ws = null
        }
    })
}

// Exporting browser or node version based on the runtime environment
export default environment.env === 'browser' ? browserWS : nodeWS