import randomebot from "./service.js"
import mastermind from "./mastermind.js";

class Bot {

    client
    options
    username
    password
    roomID
    userID

    messages = [{ sender: "", message: "" }]
    messageSentCounter
    numberOfMessages
    lastMessage = { sender: "", message: "" }
    lastMessageTime

    constructor(client, options) {
        const {username, password} = randomebot();
        this.client = client;
        this.options = options ? options : {};
        this.username = username;
        this.password = password;
        this.numberOfMessages = Math.floor(Math.random() * (100 - 20 + 1) + 20);
    }

    async start() {
        let res = await this.client.register(this.username, this.password)
        if (res.body.message === 'User created') {
            await this.client.login(this.username, this.password);
            this.userID = this.client.state.get().userID;
            await this.joinRoom();
            this.loop();
        }
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
        const stop = this.client.fresh.add(1000, () => this.client.getMessages(this.roomID), this.updateMessages);
        this.lastMessageTime = Date.now();

        this.sendDelay(mastermind())
        const id = setInterval(() => {
            console.log("here")
            const lastMessageInRoom = this.messages[this.messages.length - 1] || { sender: "", message: "" }
            if (this.lastMessage.message !== lastMessageInRoom.message && lastMessageInRoom.sender !== this.username) {

                if (this.messageSentCounter === this.numberOfMessages) {
                    // Send avsluttende melding
                    this.sendDelay(mastermind("", true))
                    stop();
                    this.logout();
                    clearInterval(id)
                    return
                }

                this.lastMessageTime = Date.now();
                this.lastMessage = lastMessageInRoom

                this.sendDelay(mastermind(this.messages[this.messages.length - 1], false))
            } else {
                if (Date.now() - this.lastMessageTime > 30_000) {
                    this.sendDelay(mastermind("", false));
                    this.lastMessageTime = Date.now()
                }
            }
        }, 500)
    }

    updateMessages = (messages) => {
        this.messages = messages;
    }

    sendDelay(message) {
        let timeout = Math.floor(Math.random() * (10 - 3 + 1) + 3);
        setTimeout(() => this.client.postMessage(this.roomID, this.userID, message), timeout);
    }

    async logout() {
        await this.client.logout(this.client.state.get().token)
    }
}

export default (client, options) => {
    return new Bot(client, options)
}