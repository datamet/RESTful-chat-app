const triggers = new Map()

const subjects = new Map()

subjects.set('pizza', 'bread with tomato and cheese')
subjects.set('bicycle', 'a bicycle is a transportation method on two wheels')
subjects.set('bike', 'a bike has two wheels')
subjects.set('programmer', 'a person that fixed a problem you dont know you have in a way you dont understand')
subjects.set('oslo', 'the capital of Norway')

const res = {
    starter: ['Hey, people!', 'Hi there, I am a bot', 'Hey lads', 'Good [day]', 'Hi, [question]'],
    ender: ['I have to go', 'cya, I have to go', 'Leaving. Talk to you later', 'Bye all'],
    question: ['How are you?', 'Do you like [food]?', 'Do you like [cloathing]', 'Tell me about bikes',
    'Are you [mood]?'],
    statement: ['The world is [mood]!', '[food] is [mood]', 'I [attitude] [cloathing]'],
    attitude: ['like', 'love', 'hate', 'somewhat like', 'dont like'],
    cloathing: ['shoes', 'socks', 'hoodies', 't-shirts', 'sweaters', 'pants', 'jackets'],
    mood: ['good', 'great', 'fine', 'ok', 'happy', 'sad', 'awesome'],
    food: ['pizza', 'meatballs', 'chocolate','chips', 'cookies', 'taco', 'burito', 'pasta', 'rice', 'salad'],
    like: ['I [attitude] [subject]'],
    haha: [':D', ':)', 'xD', 'Time goes faster when having fun!', 'The world needs more fun stuff', 'ahhahaha'],
    what: ['[subject] is [explanation]', 'I dont know a lot about [subject], but i know it is [explanation]'],
    unknown: ["I dont know what that is yet. You could try telling me by saying thing = explanation"],
    joke: ['Hardware. The part of a computer you can kick', 'What is the object oriented way to become wealty? Inheritance',
    'What do you call programmers from Norway? Nerdic', 'What is a programmers hangout place? Foo bar'],
    cool: ['cool', 'nice', 'right on, [sender]'],
    no: ['ahh, too bad', 'well, ok', 'hmm', ':/'],
    bad: ['ahh, too bad', 'well, ok', 'that sucks', ':/'],
    bye: ['goodbye [sender]!', 'bye [sender]', 'Sucks that you have to leave, see ya', 'See you buddy'],
    ok: ['well then', 'cool', 'allright then'],
    thanks: ['my pleasure', 'no worries [sender]'],
    sorry: ['no worries [sender]', 'no problem at all', 'nothing I cant handle', "it's totally fine [sender]. I am only a bot anyways."],
    places: ['Oslo', 'Berlin', 'London', 'New York', 'at my parents', 'in the woods', 'on a mountain'],
    hi: ['Hey buddy. [sender] is a cool name!', 'Good day to you!', 'Hi [sender]. [question]', 'Hello my friend. [question]'],
    up: ['I am [mood]', 'Nothing much. [statement]', 'Its an awesome day!'],
    how: ['I am [mood]', 'Fine. [statement]', 'Its an awesome day!'],
    bot: ['My name is [username]. I am a bot', 'I am [username]', '[username] is my name', 'Not a human'],
    understand: ["I didn't quite catch that. [question]", "I don't understand. Let's talk about something else. [statement]", 
    "That sentence was a bit too advanced for me. [statement]", 'Onto something else. This [day] is soo [mood]'],
    saved: ['Now I know what [subject] is!', 'Thank you for explaining what [subject] is'],
    inactive: ['Are you still here?', 'Anyone here?', 'Hellooooooooooo..', 'Someone here?', 'I guess everyone left.'],
    else: ['On to something else. [ask]', 'On to something else. [ask]', "Let's talk about sometihng else!", 'I am [mood]'],
    ask: ['What time is it?', 'Explain [food] to me please', 'Where were you born?', 'What date is it?', 'Tell me a joke!']
}

// Checks if mastermind has managed to pinpoint the subject
const subjectExsists = (original) => {
    if (res.subject) return original
    else return res.unknown
}

triggers.set('=', () => subjectExsists(res.saved))
triggers.set(' do you like ', () => subjectExsists(res.like))
triggers.set(' what is ', () => subjectExsists(res.what))
triggers.set(' who is ', () => subjectExsists(res.what))
triggers.set(' explain ', () => subjectExsists(res.what))
triggers.set(' tell us about ', () => subjectExsists(res.what))
triggers.set(' tell me about ', () => subjectExsists(res.what))

triggers.set(' hi ', () => res.hi)
triggers.set(' hello ', () => res.hi)
triggers.set(' good day ', () => res.hi)
triggers.set(' hola ', () => res.hi)
triggers.set(' hey ', () => res.hi)
triggers.set(' yo ', () => res.hi)
triggers.set(' whats up ', () => res.hi)
triggers.set(' how are you ', () => res.how)

triggers.set(' bot ', () => res.bot)
triggers.set(' who are you ', () => res.bot)
triggers.set(' are you real ', () => res.bot)
triggers.set(' you are real ', () => res.bot)
triggers.set(' you are real ', () => res.bot)
triggers.set(' are you a human ', () => res.hi)

triggers.set(' too advanced ', () => res.else)
triggers.set(' i dont understand ', () => res.else)
triggers.set(' i didnt quite catch ', () => res.else)
triggers.set(' too advanced ', () => res.else)

triggers.set(' yes ', () => res.cool)
triggers.set(' yep ', () => res.cool)
triggers.set(' yup ', () => res.cool)
triggers.set(' yeah ', () => res.cool)
triggers.set(' ok ', () => res.ok)
triggers.set(' okey ', () => res.ok)
triggers.set(' nope ', () => res.no)
triggers.set(' no ', () => res.no)
triggers.set(' nah ', () => res.no)
triggers.set(' nix ', () => res.no)
triggers.set(' sorry ', () => res.sorry)
triggers.set(' is bad ', () => res.bad)
triggers.set(' agree ', () => res.else)
triggers.set(' cool ', () => res.else)
triggers.set(' nice ', () => res.else)
triggers.set(' right on ', () => res.else)
triggers.set(' to bad ', () => res.else)
triggers.set(' no worries ', () => res.else)
triggers.set(' thank you ', () => res.thanks)
triggers.set(' thanks ', () => res.thanks)
triggers.set(' ty ', () => res.thanks)
triggers.set(' thankyou ', () => res.thanks)

triggers.set(' i am fine ', () => res.cool)
triggers.set(' i am good ', () => res.cool)
triggers.set(' i am great ', () => res.cool)
triggers.set(' i am ok ', () => res.ok)
triggers.set(' i am ill ', () => res.no)
triggers.set(' i am happy ', () => res.cool)
triggers.set(' i am down ', () => res.no)
triggers.set(' i am depressed ', () => res.no)
triggers.set(' i am overwhelmed ', () => res.no)
triggers.set(' i am stressed ', () => res.no)
triggers.set(' i am not good ', () => res.no)

triggers.set(' tell me a joke ', () => res.joke)
triggers.set(' tell us a joke ', () => res.joke)

triggers.set(' live anywhere ', () => res.places)
triggers.set(' want to live ', () => res.places)
triggers.set(' name a place ', () => res.places)
triggers.set(' where do you live ', () => res.places)
triggers.set(' where were you born ', () => res.places)
triggers.set(' what is the time ', () => res.time)
triggers.set(' time is it ', () => res.time)
triggers.set(' it today ', () => res.date)
triggers.set(' what date is it ', () => res.date)
triggers.set(' what is the date ', () => res.date)
triggers.set(' what year ', () => res.date)
triggers.set(' what month ', () => res.date)
triggers.set(' what day ', () => res.date)

triggers.set(' lol ', () => res.haha)
triggers.set(' haha ', () => res.haha)
triggers.set(' hahaha ', () => res.haha)
triggers.set(' hah ', () => res.haha)
triggers.set(' hahahah ', () => res.haha)
triggers.set(' ahahha ', () => res.haha)
triggers.set(' ahah ', () => res.haha)
triggers.set(' ahahhaha ', () => res.haha)

triggers.set(' goodbye ', () => res.bye)
triggers.set(' bye ', () => res.bye)
triggers.set(' be back ', () => res.bye)
triggers.set(' i am leaving ', () => res.bye)
triggers.set(' good bye ', () => res.bye)
triggers.set(' see you ', () => res.bye)
triggers.set(' goodnight ', () => res.bye)
triggers.set(' good night ', () => res.bye)
triggers.set(' i have to go ', () => res.bye)

// Pick random element of array
const rand = arr => arr[Math.floor(Math.random() * arr.length)];

// Recursively create message by replacing everything in brackets
const createRespons = reply =>{
    reply = rand(reply)
    while (true) {
        if (reply.indexOf('[') > -1 && reply.indexOf(']') > -1) {
            const replace = reply.substring(
                reply.indexOf('[') + 1, 
                reply.indexOf(']')
            )
            if (res[replace]) {
                const splitReply = reply.split(new RegExp(`(\\[${replace}\\])`, 'g'))
                const i = splitReply.indexOf(`[${replace}]`)
                splitReply[i] = createRespons(res[replace])
                reply = splitReply.join('')
            }
        }
        else {
            break
        }
    }
    return reply
}

// Add message context before creating message
const addContext = ({ username }, sender, message) => {
    res.username = [username]
    if (sender) res.sender = [sender]
    const date = new Date()
    const hours = date.getHours()
    const isDayTime = hours > 6 && hours < 20
    res.time = [isDayTime ? 'day' : 'night', `${hours} o'clock`]
    res.day = [isDayTime ? 'day' : 'night']
    const fullDate = `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`
    res.date = [`Today is ${fullDate}`, `The date is ${fullDate}`]
    
    // Check for subject matches
    if (message) {
        if (message.includes('=')) {
            let splitMessage = message.split('=')
            if (splitMessage.length === 2) {
                res.subject = [splitMessage[0].trim()]
                res.explanation = [splitMessage[1].slice(1)]
                subjects.set(splitMessage[0].trim(), splitMessage[1].slice(1))
            }
            else {
                res.subject = null
                res.explanation = null
            }
        }
        else {
            for (const [ subject, explanation ] of subjects) {
                if (message.includes(subject)) {
                    res.subject = [subject]
                    res.explanation = [explanation]
                    break
                } else {
                    res.subject = null
                    res.explanation = null
                }
            }
        }
    }
    else {
        res.subject = null
        res.explanation = null
    }
}

export default info => (msg, options) => {
    // check that message is not null
    let response = '', processed = ''
    addContext(info, msg ? msg.sender : null, msg ? msg.message : null)
    if (options ? options.starter : false) return createRespons(res.starter)
    if (options ? options.ender : false) return createRespons(res.ender)
    if (!msg) return createRespons(res.inactive)
    const { sender, message } = msg
    if (message) {
        // Process input to be easier to match
        processed = message.toLowerCase()
            .replace('!', '')
            .replace('.', '')
            .replace(',', '')
            .replace("'", '')
            .replace('"', '')
            .replace('-', ' ')
            .replace('_', ' ')
            .replace('?', '')
            .replace('*', '')
            .replace('`', '')
            .replace('(', '')
            .replace(')', '')
        processed = ` ${processed} `
    
        // Check for frase matches
        for (const [word, reply] of triggers) {
            if (processed.includes(word)) {
                response = createRespons(reply())
                break
            }
        }
    }
    // Answer didn't understand if no match is found
    if (!response) response = createRespons(res.understand)

    return response
}