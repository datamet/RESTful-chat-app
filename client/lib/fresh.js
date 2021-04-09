/**
 * Module that performs an async operation multiple times with a given interval
 * or whenever a push notification is recieved from the server.
 * Mostly used to fetch messages or other information on loop
 */


const subs = new Map()

let started = false

// Fetches changes and does callback
const fetchBackend = async (func, callback, stop) => {
    try {
        const res = await func()
        callback(res)
    }
    catch(err) {
        stop()
    }
}

const createStopper = id => () => {
    subs.delete(id)
    clearInterval(id)
}

const add = (interval, func, callback) => {

    const id = setInterval(() => {
        if (started) fetchBackend(func, callback, createStopper(id))
    }, interval)

    subs.set(id, { interval, func, callback })
    return createStopper(id)  
}

const update = () => {
    for (const [id, { func, callback }] of subs) {
        fetchBackend(func, callback, createStopper(id))
    }
}

export default {
    start: () => started = true,
    stop: () => started = false,
    add,
    update
}