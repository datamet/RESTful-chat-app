/**
 * Client state
 * 
 * Storing state. Predominantly token and userID 
 */

class State {
    state
    subscribers

    constructor() {
        this.state = {}
        this.subscribers = []
    }

    // Get copy of state
    get() {
        return {...this.state}
    }

    // Add or change properties on state
    update(newState) {
        this.state = { ...this.state, ...newState }
        // Call all subscribers with new state
        for (const subscriber of this.subscribers) {
            subscriber({...this.state})
        }
    }

    // Subscribe to state changes
    subscribe(subscriber) { 
        this.subscribers.push(subscriber)
        return () => this.subscribers.splice(this.subscribers.indexOf(subscriber), 1)
    }

}

export default () => new State()
