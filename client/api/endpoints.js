/**
 * API endpoints
 */

const routes = server => { return {
    // User routes
    register: (username, password) => server.post('/api/users', { body: { username, password }}),
    registerBot: (username, password) => server.post('/api/users', { body: { username, password, bot: true }}),
    getUsers: () => server.get('/api/users'),
    getUser: (userID) => server.get(`/api/user/${userID}`),
    // router.delete('/user/:userID', users.deleteUser)

    // // Token routes
    login: (username, password) => server.post('/api/tokens', { body: { username, password }}),
    // router.get('/token/:tokenID', tokens.getToken)
    // router.put('/token/:tokenID', tokens.extendToken)
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
    // router.get('/room/:roomID/:userID/messages', rooms.getMessagesFromUser)
    checkPush: () => server.get('/api/push')
}}

export default (interactor) => {
    return routes(interactor)
}