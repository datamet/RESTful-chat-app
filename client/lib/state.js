// let state = {}
// let subscribers = []

class State {
    state
    subscribers

    constructor() {
        this.state = {}
        this.subscribers = []
    }

    get() {
        return {...this.state}
    }

    update(newState) {
        this.state = { ...this.state, ...newState }
        for (const subscriber of this.subscribers) {
            subscriber({...this.state})
        }
    }

    subscribe(subscriber) { 
        this.subscribers.push(subscriber)
        return () => this.subscribers.splice(this.subscribers.indexOf(subscriber), 1)
    }

}

export default () => new State()

// export default {
//     get: () => {return {...state}},
//     update: (newState) => {
//         state = { ...state, ...newState }
//         for (const subscriber of subscribers) {
//             subscriber({...state})
//         }
//     },
//     subscribe: (subscriber) => { 
//         subscribers.push(subscriber)
//         return () => subscribers.splice(subscribers.indexOf(subscriber), 1)
//     }
// }

