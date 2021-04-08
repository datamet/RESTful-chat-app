import { randomebot } from "./service.js"

class Bot {

    client
    options
    username
    password


    constructor(client, options) {
        const { username, password } = randomebot();
        this.client = client;
        this.options = options;
        this.username = username;
        this.password = password;
    }

    start() {
        this.loggin();
    }

    async loggin() {
        await this.client.loggin(this.username, this.password);
    }

    async joinRoom() {
        const { userID } = this.client.state.get();
        const roomToJoin = options.room ? this.options.room : "Botroom";

        const res = await this.client.getRooms()
        for (const room of res.rooms) {
            if (room.name === roomToJoin) {
                await this.client.joinRoom(room.id, userID);
                return;
            }
        }

        await this.client.createRoom(roomToJoin);
        const res =  await this.client.getRooms()

        for(const room of res.rooms){
            if(room.name === roomToJoin){
                await this.client.joinRoom(room.id, userID);
            }
        }
    }

    createRoom() {

    }

    sendMessage() {

    }

    logout() {

    }
}

export default (client, options) => {
    return new Bot(client)
}