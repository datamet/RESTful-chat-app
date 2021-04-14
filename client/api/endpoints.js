/**
 * API endpoints
 * 
 * A convenient collection of all the requests you can make to the
 * backend api. Uses the client core to send requests
 */

const routes = core => { return {
    // User routes
    register: (username, password) => core.post('/api/users', { body: { username, password }}),
    registerBot: (username, password) => core.post('/api/users', { body: { username, password, bot: true }}),
    getUsers: () => core.get('/api/users'),
    getUser: (userID) => core.get(`/api/user/${userID}`),
    deleteUser: (userID) => core.delete(`/api/user/${userID}`),

    // // Token routes
    login: (username, password) => core.post('/api/tokens', { body: { username, password }}),
    getTokens: () => core.get('/api/tokens'),
    extendToken: (tokenID) => core.post(`/api/token/${tokenID}`),
    logout: (tokenID) => core.delete(`/api/token/${tokenID}`),

    // // Chatroom routes
    createRoom: (name) => core.post('/api/rooms', { body: { name }}),
    getRooms: () => core.get('/api/rooms'),
    getRoom: (roomID) => core.get(`/api/room/${roomID}`),
    deleteRoom: (roomID) => core.delete(`/api/room/${roomID}`),

    joinRoom: (roomID, user) => core.post(`/api/room/${roomID}/users`, { body: { user } }),
    getUsersInRoom: (roomID) => core.get(`/api/room/${roomID}/users`),

    getMessages: (roomID) => core.get(`/api/room/${roomID}/messages`),
    postMessage: (roomID, userID, message) => core.post(`/api/room/${roomID}/${userID}/messages`, { body: { message } }),
    getMessagesFromUser: (roomID, userID) => core.get(`/room/${roomID}/${userID}/messages`),
    checkPush: () => core.get('/api/push')
}}

export default (interactor) => {
    return routes(interactor)
}