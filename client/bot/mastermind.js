/**
 * 
 */

const trigger = [
    ["hi", "hey", "hello"],
    ["how are you", "how are things"],
    ["what is going on", "what is up"],
    ["happy", "good", "well", "fantastic", "cool"],
    ["bad", "bored", "tired", "sad"],
    ["tell me story", "tell me joke"],
    ["thanks", "thank you"],
    ["bye", "good bye", "goodbye"]
];

const reply = [
    ["Hello!", "Hi!", "Hey!", "Hi there!"],
    [
        "Fine... how are you?",
        "Pretty well, how are you?",
        "Fantastic, how are you?"
    ],
    [
        "Nothing much",
        "Exciting things!"
    ],
    ["Glad to hear it"],
    ["Why?", "Cheer up buddy"],
    ["What about?", "Once upon a time..."],
    ["You're welcome", "No problem"],
    ["Goodbye", "See you later"],
];

const alternative = [
    "Same",
    "Go on...",
    "Try again",
    "I'm listening...",
    "Bro..."
];

const robot = ["How do you do, fellow human", "I am not a bot"];

const compare = (triggerArray, replyArray, text) => {
    let item;
    for (let i = 0; i < triggerArray.length; i++) {
        for (let j = 0; j < replyArray.length; j++) {
            if (triggerArray[i][j] === text) {
                let items = replyArray[i];
                item = items[Math.floor(Math.random() * items.length)];
            }
        }
    }
    return item;
}

export const output = input => {
    let product;
    let text = input.toLowerCase().replace(/[^\w\s\d]/gi, "");
    text = text
        .replace(/ a /g, " ")
        .replace(/i feel /g, "")
        .replace(/whats/g, "what is")
        .replace(/please /g, "")
        .replace(/ please/g, "");

    //compare arrays
    //then search keyword
    //then random alternative

    if (compare(trigger, reply, text)) {
        product = compare(trigger, reply, text);
    } else if (text.match(/robot/gi)) {
        product = robot[Math.floor(Math.random() * robot.length)];
    } else {
        product = alternative[Math.floor(Math.random() * alternative.length)];
    }

    return product;
}