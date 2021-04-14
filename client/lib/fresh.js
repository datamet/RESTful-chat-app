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
        if (errCallback) errCallback()
        stop()
    }
}


class Fresh {
    subs
    started

    constructor() {
        this.subs = new Map()
        this.started = false

        // Start and stop periodic fetch
        this.start = () => this.started = true
        this.stop = () => this.started = false

        // Binds a timeout id to a stopper function
        this.createStopper = id => () => {
            this.subs.delete(id)
            clearInterval(id)
        }
    
        // Adds an interval subscriber. 
        this.add = (interval, func, callback, errCallback) => {
    
            // Fetching on repeat if push notification are not enabled
            const id = setInterval(() => {
                if (this.started) fetchBackend(func, callback, this.createStopper(id), errCallback)
            }, interval)
    
            // store new subscriber and return stop method
            this.subs.set(id, { interval, func, callback, errCallback })
            return this.createStopper(id)  
        }
    
        // Calls all subscribers with an update
        this.update = (options) => {
            if (options && options.start) this.started = true
            if (options && !options.start) {
                this.started = false
                return
            }
            for (const [id, { func, callback, errCallback }] of this.subs) {
                fetchBackend(func, callback, this.createStopper(id), errCallback)
            }
        }
    }

}

export default () => new Fresh()