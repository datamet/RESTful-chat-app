import {randomebot} from "./service.js"
// import {fresh} from "../lib/fresh.js"

class Bot {

    client
    options
    username
    password
    roomID

    messages
    messageSentCounter
    numberOfMessages

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
        await this.joinRoom();
        this.loop();
    }

    async joinRoom() {
        const {userID} = this.client.state.get();
        const roomToJoin = this.options.room ? this.options.room : "Botroom";

        let res = await this.client.getRooms()
        for (const room of res.rooms) {
            if (room.name === roomToJoin) {
                await this.client.joinRoom(room.id, userID);
                this.roomID = room.id;
                return;
            }
        }

        await this.client.createRoom(roomToJoin);
        res = await this.client.getRooms()

        for (const room of res.rooms) {
            if (room.name === roomToJoin) {
                await this.client.joinRoom(room.id, userID);
                this.roomID = room.id;
                return;
            }
        }
    }

    loop() {
        fresh(500, () => this.client.getMessages(this.roomID), this.updateMessages);
        while (true) {
            // Sjekke om det har kommet noen nye meldinger (this.messages)
            // Hvis det er det så kan den velge om den vil svare eller ikke
            // Hvis det har gått så og så lang tid siden sist melding så poster den selv
            // Ha en counter som teller tid
            // Sende melding med send funksjonen

            if (this.messageSentCounter === this.numberOfMessages) {
                // Send avsluttende melding
                break;
            }
        }
    }

    updateMessages(messages) {
        this.messages = messages;
    }

    respond() {

    }

    send() {
        // Ha en random delay. Slik at svaret ikke kommer med en gang
    }

    logout() {

    }
}

export default (client, options) => {
    return new Bot(client, options)
}