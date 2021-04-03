let state = {}
let subscribers = []

export default {
    get: () => {return {...state}},
    update: (newState) => {
        state = { ...state, ...newState }
        for (const subscriber of subscribers) {
            subscriber({...state})
        }
    },
    subscribe: (subscriber) => { 
        subscribers.push(subscriber)
        return () => subscribers.splice(subscribers.indexOf(subscriber), 1)
    }
}

