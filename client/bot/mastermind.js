const activate = [
    ["hello", "hi", "hey"],
    ["how are you", "how are things"],
    ["what is going on", "what is up"],
    ["happy", "good", "well", "fantastic", "cool"],
    ["bad", "bored", "tired", "sad"],
    ["tell me story", "tell me joke"],
    ["thanks", "thank you"],
    ["bye", "good bye", "goodbye"]
];

const reply = [
    ["Hello!", "Hey!", "Hi!", "Hello there!"],
    ["Fine... how are you?", "Pretty well, how are you?", "Fantastic, how are you?"],
    ["Nothing much", "Exciting things!"],
    ["Glad to hear!"],
    ["Why?", "Cheer up buddy"],
    ["What about?", "Once upon a time...", "Don't have time, sorry!"],
    ["You're welcome", "You owe me one!", "No problem"],
    ["Goodbye", "See you later", "See you soon"],
];

const alternative = [
    "I'm listening...",
    "Go on...",
    "Continue",
    "Haha",
    "Same",
    "Try again",
    "I dont understand",
    "Omg!",
    "Bro..."
];

const starters = [
    "Anyone here?",
    "Hello",
    "Who is here?",
    "How are you doing",
    "I am here!",
    "Am I alone here?"
];

const enders = ["I have to leave!",
    "I will be back soon",
    "Have a nice day, bye!",
    "I have to go"
];

const robot = [
    "How do you do, fellow human",
    "I am not a bot"
];

const compare = text => {
    let item;
    for (let i = 0; i < activate.length; i++) {
        for (let j = 0; j < reply.length; j++) {
            if (activate[i][j] === text) {
                let items = reply[i];
                item = items[Math.floor(Math.random() * items.length)];
            }
        }
    }
    return item;
}

const starter = () => {
    return starters[Math.floor(Math.random() * starters.length)];
}

const ender = () => {
    return enders[Math.floor(Math.random() * starters.length)];
}

export default (input, end) => {
    if (end) {
        return ender();
    }
    if (!input) {
        return starter();
    }

    let text = input.message.toLowerCase().replace(/[^\w\s\d]/gi, "");
    text = text
        .replace(/ a /g, " ")
        .replace(/i feel /g, "")
        .replace(/whats/g, "what is")
        .replace(/please /g, "")
        .replace(/ please/g, "");

    if (compare(activate, reply, text)) {
        return compare(text);
    } else if (text.match(/robot/gi)) {
        return robot[Math.floor(Math.random() * robot.length)];
    } else {
        return alternative[Math.floor(Math.random() * alternative.length)];
    }
}