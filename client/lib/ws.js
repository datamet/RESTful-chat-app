export default (url, { socketModule, update, state }) => {
    let ws
    let notify = update

    const createWebsocket = (url, SocketModule) => {
        const ws = SocketModule ? new SocketModule(url) : new WebSocket(url)

        ws.onerror = (event) => {
            console.log(event)
            ws.close()
        }

        return ws
    }

    const handleMessage = (event) => {
        console.log(event)
        notify()
    }

    state.subscribe(({ token }) => {
        if (token && !ws) {
            ws = createWebsocket(url, socketModule ? socketModule : null)
            ws.onopen = () => ws.send(token)
            ws.onmessage = (event) => handleMessage(event)
        }
        else if (!token && ws) {
            ws.close()
            ws = null
        }
    })
}