import {randomebot} from "./service.js"
import {output} from "./mastermind";
import client from "../client";

// import {fresh} from "../lib/fresh.js"

class Bot {

    client
    options
    username
    password
    roomID
    userID

    messages
    messageSentCounter
    numberOfMessages
    lastMessage
    lastMessageTime

    constructor(client, options) {
        const {username, password} = randomebot();
        this.client = client;
        this.options = options;
        this.username = username;
        this.password = password;
        this.numberOfMessages = Math.floor(Math.random() * (100 - 20 + 1) + 20);
    }

    async start() {
        await this.client.login(this.username, this.password);
        this.userID = this.client.state.get().userID;
        await this.joinRoom();
        this.loop();
    }

    async joinRoom() {
        const roomToJoin = this.options.room ? this.options.room : "Botroom";

        let res = await this.client.getRooms()
        for (const room of res.rooms) {
            if (room.name === roomToJoin) {
                await this.client.joinRoom(room.id, this.userID);
                this.roomID = room.id;
                return;
            }
        }

        await this.client.createRoom(roomToJoin);
        res = await this.client.getRooms()

        for (const room of res.rooms) {
            if (room.name === roomToJoin) {
                await this.client.joinRoom(room.id, this.userID);
                this.roomID = room.id;
                return;
            }
        }
    }

    loop() {
        fresh(500, () => this.client.getMessages(this.roomID), this.updateMessages);
        this.lastMessageTime = Date.now();

        while (true) {
            if (this.lastMessage !== this.messages[this.messages.length - 1]) {
                // Sjekke om det har kommet noen nye meldinger (this.messages)
                // Hvis det er det så kan den velge om den vil svare eller ikke

                // Oppdaterer tiden
                this.lastMessageTime = Date.now();

                if (this.messages) {
                    if (Math.random() < 0.5) {
                        return;
                    }
                }

                this.sendDelay(output(this.messages[this.messages.length - 1], false))

                // Hvis det har gått så og så lang tid siden sist melding så poster den selv
                // Ha en counter som teller tid
                // Sende melding med send funksjonen

                if (this.messageSentCounter === this.numberOfMessages) {
                    // Send avsluttende melding
                    this.sendDelay(output("", true))
                    break;
                }
            }else {
                if (Date.now() - this.lastMessageTime > 30_000) {
                    this.sendDelay(output("", false))
                }
            }
            this.lastMessage = this.messages[this.messages.length - 1];
        }
    }

    updateMessages(messages) {
        this.messages = messages;
    }

    sendDelay(message) {
        // Ha en random delay mellom 3 og 10 sek. Slik at svaret ikke kommer med en gang
        let timeout = Math.floor(Math.random() * (10 - 3 + 1) + 3);
        setTimeout(() => this.client.postMessage(this.roomID, this.userID, message), timeout);
    }

    logout() {

    }
}

export default (client, options) => {
    return new Bot(client, options)
}