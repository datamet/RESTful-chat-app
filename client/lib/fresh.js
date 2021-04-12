/**
 * Module that performs an async operation multiple times with a given interval
 * or whenever a push notification is recieved from the server.
 * Mostly used to fetch messages or other information on loop
 */

// Fetches changes and does callback
const fetchBackend = async (func, callback, stop) => {
    try {
        const res = await func()
        callback(res)
    }
    catch(err) {
        console.log("Error while fetching. Stopping")
        console.log(err)
        stop()
    }
}

class Fresh {
    subs
    started

    constructor() {
        this.subs = new Map()
        this.started = false

        this.createStopper = id => () => {
            this.subs.delete(id)
            clearInterval(id)
        }
    
        this.add = (interval, func, callback) => {
    
            const id = setInterval(() => {
                if (this.started) fetchBackend(func, callback, this.createStopper(id))
            }, interval)
    
            this.subs.set(id, { interval, func, callback })
            return this.createStopper(id)  
        }
    
        this.update = () => {
            for (const [id, { func, callback }] of this.subs) {
                fetchBackend(func, callback, this.createStopper(id))
            }
        }
    }

}

// const subs = new Map()

// let started = false

// // Fetches changes and does callback
// const fetchBackend = async (func, callback, stop) => {
//     try {
//         const res = await func()
//         callback(res)
//     }
//     catch(err) {
//         console.log("Error while fetching. Stopping")
//         for (const [id, sub] of subs) console.log(sub.func, sub.callback, sub.interval)
//         console.log(err)
//         stop()
//     }
// }

// const createStopper = id => () => {
//     subs.delete(id)
//     clearInterval(id)
// }

// const add = (interval, func, callback) => {

//     const id = setInterval(() => {
//         if (started) fetchBackend(func, callback, createStopper(id))
//     }, interval)

//     subs.set(id, { interval, func, callback })
//     return createStopper(id)  
// }

// const update = () => {
//     for (const [id, { func, callback }] of subs) {
//         fetchBackend(func, callback, createStopper(id))
//     }
// }

export default () => new Fresh()