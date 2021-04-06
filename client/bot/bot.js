import { randomebot } from "./service.js"

class Bot{

    client
    bot

    constructor(client){
        this.client = client;
        bot = randomebot();
    }

    loggin(){
        
    }

    logout(){

    }

    sendMessage(){

    }
}

export default (client) => {
    return new Bot(client)
}