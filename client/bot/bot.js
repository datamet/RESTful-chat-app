import randomebot from "./service.js"
import mastermind from "./mind.js";

class Bot {
    client
    options
    username
    password
    roomID
    userID
    loopID
    mastermind

    unresponsive = 0
    messages = []
    newMessages = []
    messageSentCounter = 0
    numberOfMessages
    lastMessage = { sender: "", message: "" }
    lastMessageTime

    constructor(client, options) {
        let { username, password } = randomebot();
        if (options.name) username = options.name
        this.client = client;
        this.options = options ? options : {};
        this.username = username;
        this.password = password;
        this.numberOfMessages = Math.floor(Math.random() * (30 - 10 + 1) + 10);
        this.mastermind = mastermind({ username: this.username });
    }

    async start() {
        let res = await this.client.registerBot(this.username, this.password)
        if (res.body.message === 'User created') {
            res = await this.client.login(this.username, this.password);
            if (res.body.message === 'Logged in') {
                this.userID = this.client.state.get().userID;
                try {
                    await this.joinRoom();
                }
                catch (err) {
                    this.shutdown()
                    return
                }
                res = await this.client.getMessages(this.roomID)
                if (res) this.messages = res.body.messages
                this.loop()
                return
            }
        }
        this.shutdown()
    }

    async joinRoom() {
        const roomToJoin = this.options.room ? this.options.room : "Botroom";

        let res = await this.client.getRooms()
        for (const room of res.body.rooms) {
            if (room.name === roomToJoin) {
                await this.client.joinRoom(room.id, this.userID);
                this.roomID = room.id;
                return;
            }
        }

        await this.client.createRoom(roomToJoin);
        res = await this.client.getRooms()

        for (const room of res.body.rooms) {
            if (room.name === roomToJoin) {
                this.roomID = room.id;
                this.admin = true
                return;
            }
        }
    }

    shouldBeAlive() {
        if (this.messageSentCounter === this.numberOfMessages) {
            this.shutdown()
            return
        }
    }

    nextMessage() {
        if (this.newMessages.length > 0) {
            const message = this.newMessages.shift()
            this.messages.push(message)
            if (message.sender !== this.username) return message
        }
    }

    loop() {
        const stop = this.client.fresh.add(1000, () => this.client.getMessages(this.roomID), this.updateMessages, this.shutdown);
        this.lastMessageTime = Date.now();
        this.sendDelay(this.mastermind(null, { starter: true }))
        const id = setInterval(() => {
            const msg = this.nextMessage()
            if (msg) {
                // Checking if bot has been alive too long
                this.shouldBeAlive()

                // Updating last message time
                this.lastMessageTime = Date.now();

                // Sending response
                this.sendDelay(this.mastermind(msg))
            } else {
                // Checkin time since last message
                if (Date.now() - this.lastMessageTime > 30_000) {
                    // Checking if unresponsive twice
                    this.unresponsive += 1
                    if (this.unresponsive === 2) {
                        this.shutdown() 
                        return
                    }

                    // Sending conversation starter
                    this.send(this.mastermind());
                    this.lastMessageTime = Date.now()
                }
            }
        }, 500)
        this.stopFresh = stop
        this.loopID = id
    }

    shutdown = async (reason) => {
        if (this.loopID) clearInterval(this.loopID)
        if (this.stopFresh) this.stopFresh();
        if (reason !== 'server down') {
            if (this.roomID) this.send(this.mastermind(null, { ender: true }))
            if (!this.admin) this.deregister()
            else this.logout()
        }
    }

    updateMessages = (res) => {
        const fresh = [...res.body.messages]
        this.newMessages = fresh.slice(this.messages.length, fresh.length)
    }

    send(message) {
        this.messageSentCounter += 1
        const postMessage = async () => {
            const res = await this.client.postMessage(this.roomID, this.userID, message)
            if (res.body.error) this.shutdown("server down")
        }
        postMessage()
    }

    sendDelay(message) {
        let timeout = Math.floor(Math.random() * (10 - 4 + 1) + 4);
        setTimeout(() => {
            this.send(message)
        }, timeout);
    }

    async deregister() {
        await this.client.deleteUser(this.userID)
    }

    async logout() {
        await this.client.logout(this.client.state.get().token)
    }
}

export default (client, options) => {
    return new Bot(client, options)
}