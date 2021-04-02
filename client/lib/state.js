let state = {}

export default {
    get: () => {return {...state}},
    update: (newState) => state = { ...state, ...newState }
}

