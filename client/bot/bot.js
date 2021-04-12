import randomebot from "./service.js"
import mastermind from "./mastermind.js";

class Bot {

    client
    options
    username
    password
    roomID
    userID
    loopID

    unresponsive = 0
    messages = [{ sender: "", message: "" }]
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
        this.numberOfMessages = Math.floor(Math.random() * (100 - 20 + 1) + 20);
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
                await this.client.joinRoom(room.id, this.userID);
                this.roomID = room.id;
                return;
            }
        }
    }

    loop() {
        const stop = this.client.fresh.add(1000, () => this.client.getMessages(this.roomID), this.updateMessages, this.shutdown);
        this.lastMessageTime = Date.now();

        this.sendDelay(mastermind())
        const id = setInterval(() => {
            const lastMessageInRoom = this.messages[this.messages.length - 1] || { sender: "", message: "" }
            // Checking for new message
            if (this.lastMessage.message !== lastMessageInRoom.message && lastMessageInRoom.sender !== this.username) {

                // Checking if bot has been alive too long
                if (this.messageSentCounter === this.numberOfMessages) {
                    this.shutdown(stop, id)
                    return
                }

                // Updating last message
                this.lastMessageTime = Date.now();
                this.lastMessage = lastMessageInRoom

                // Sending response
                this.sendDelay(mastermind(this.messages[this.messages.length - 1], false))
            } else {
                // Checkin time since last message
                if (Date.now() - this.lastMessageTime > 30_000) {
                    // Sending conversation starter
                    this.unresponsive += 1
                    if (this.unresponsive === 3) {
                        this.shutdown() 
                        return
                    }
                    this.sendDelay(mastermind("", false));
                    this.lastMessageTime = Date.now()
                }
            }
        }, 500)
        this.stopFresh = stop
        this.loopID = id
    }

    shutdown = (reason) => {
        if (this.loopID) clearInterval(this.loopID)
        if (this.stopFresh) this.stopFresh();
        if (reason !== 'server down') {
            if (this.roomID) this.send(mastermind("", true))
            this.deregister();
        }
    }

    updateMessages = (messages) => {
        this.messages = messages;
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
        let timeout = Math.floor(Math.random() * (10 - 3 + 1) + 3);
        setTimeout(() => {
            this.send(message)
        }, timeout);
    }

    async deregister() {
        await this.client.deleteUser(this.userID)
    }
}

export default (client, options) => {
    return new Bot(client, options)
}