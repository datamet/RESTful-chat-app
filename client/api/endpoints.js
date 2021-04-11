/**
 * API endpoints
 */

let server

const routes = {
    // User routes
    register: (username, password) => server.post('/api/users', { body: { username, password }}),
    getUsers: () => server.get('/api/users'),
    getUser: (userID) => server.get(`/api/user/${userID}`),
    deleteUser: (userID) => server.delete(`/api/user/${userID}`),

    // // Token routes
    login: (username, password) => server.post('/api/tokens', { body: { username, password }}),
    getTokens: () => server.get('/api/tokens'),
    extendToken: (tokenID) => server.post(`/api/token/${tokenID}`),
    logout: (tokenID) => server.delete(`/api/token/${tokenID}`),

    // // Chatroom routes
    createRoom: (name) => server.post('/api/rooms', { body: { name }}),
    getRooms: () => server.get('/api/rooms'),
    getRoom: (roomID) => server.get(`/api/room/${roomID}`),
    deleteRoom: (roomID) => server.delete(`/api/room/${roomID}`),

    joinRoom: (roomID, user) => server.post(`/api/room/${roomID}/users`, { body: { user } }),
    getUsersInRoom: (roomID) => server.get(`/api/room/${roomID}/users`),

    getMessages: (roomID) => server.get(`/api/room/${roomID}/messages`),
    postMessage: (roomID, userID, message) => server.post(`/api/room/${roomID}/${userID}/messages`, { body: { message } }),
    getMessagesFromUser: (roomID, userID) => server.get(`/room/${roomID}/${userID}/messages`)
}

export default (interactor) => {
    server = interactor
    return routes
}