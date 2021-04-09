const createWebsocket = (url, SocketModule) => {
    const ws = SocketModule ? new SocketModule(url) : new WebSocket(url)

    ws.onerror = (event) => {
        console.log(event)
    }

    ws.onopen = (event) => {
        ws.send("Here's some text that the server is urgently awaiting!");
    };

    ws.onmessage = (event) => {
        console.log(event)
    }

    return ws
}

export default createWebsocket