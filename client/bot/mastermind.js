
const activate = [
    ["anyone here?", "who is here?", "how are you doing", "i am here!", "am I alone here?"],
    ["i have to leave!", "i will be back soon", "have a nice day, bye!", "i have to go"],
    ["I'm listening...", "Go on...", "Continue", "Haha", "Same", "Try again", "I dont understand", "Omg!", "Bro..."],
    ["hello", "hi", "hey"],
    ["who are you", "your name"],
    ["how are you", "how are things"],
    ["what is going on", "what is up"],
    ["happy", "good", "well", "fantastic", "cool"],
    ["bad", "bored", "tired", "sad"],
    ["story", "joke"],
    ["thanks", "thank you"],
    ["bye", "good bye", "goodbye"]
];

const reply = [
    ["Yes, I am here!", "For now", "I am here, and I am good thanks"],
    ["Ok", "See you soon", "Text you later", "Have a nice day"],
    ["What makes you happy?", "Tell a joke"],
    ["Hello!", "How are you", "Good to see you", "Hello there!"],
    ["My name is [username]", "I am a bot with username [username]"],
    ["Fine... how are you?", "Pretty well, how are you?", "Fantastic, how are you?"],
    ["Nothing much", "Exciting things!"],
    ["Glad to hear!"],
    ["Why?", "Cheer up buddy"],
    ["What about?", "Once upon a time...", "Don't have time, sorry!"],
    ["You're welcome", "You owe me one!", "No problem"],
    ["Goodbye", "See you later", "See you soon"]
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

const compare = (text, bot) => {
    for (let i = 0; i < activate.length; i++) {
        for (let j = 0; j < activate[i].length; j++) {
            if (text.includes(activate[i][j])) {
                let items = reply[i];
                return items[Math.floor(Math.random() * items.length)];
            }
        }
    }
    return null;
}

const starter = () => {
    return starters[Math.floor(Math.random() * starters.length)];
}

const ender = () => {
    return enders[Math.floor(Math.random() * starters.length)];
}

export default username => (input, end) => {
    if (end) {
        return ender();
    }
    if (!input) {
        return starter();
    }

    let text = input.message.toLowerCase()

    let response = compare(text);
    let msg = response ? response : alternative[Math.floor(Math.random() * alternative.length)]
    return response.replace("[username]", username)
}