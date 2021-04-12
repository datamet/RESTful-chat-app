import environment from './config.js'

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

    const handleMessage = (event) => {
        notify()
    }

    state.subscribe(({ token }) => {
        if (token && !ws) {
            ws = createWebsocket(url)
            ws.onopen = () => ws.send(token)
            ws.onmessage = (event) => handleMessage(event)
        }
        else if (!token && ws) {
            ws.close()
            ws = null
        }
    })
}

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

    const handleMessage = (event) => {
        notify()
    }

    state.subscribe(({ token }) => {
        if (token && !ws) {
            ws = createWebsocket(url, SocketModule)
            ws.on('open', () => ws.send(token))
            ws.on('message', (event) => handleMessage(event))
        }
        else if (!token && ws) {
            ws.close()
            ws = null
        }
    })
}

export default environment.env === 'browser' ? browserWS : nodeWS