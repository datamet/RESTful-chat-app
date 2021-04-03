/**
 * API endpoints
 */

let server

const routes = {
    // User routes
    register: (username, password) => server.post('/api/users', { body: { username, password }}),
    getUsers: () => server.get('/api/users'),
    getUser: (userID) => server.get(`/api/user/${userID}`),
    // router.delete('/user/:userID', users.deleteUser)

    // // Token routes
    login: (username, password) => server.post('/api/tokens', { body: { username, password }}),
    // router.get('/token/:tokenID', tokens.getToken)
    // router.put('/token/:tokenID', tokens.extendToken)
    logout: (tokenID) => server.delete(`/api/token/${tokenID}`),

    // // Chatroom routes
    // router.post('/rooms', rooms.createRoom)
    getRooms: () => server.get('/api/rooms'),
    // router.get('/room/:roomID', rooms.getRoom)
    // router.delete('/room/:roomID', rooms.deleteRoom)

    joinRoom: (roomID, userID) => server.post(`/api/room/${roomID}/users`, { body: { userID } })
    // router.get('/room/:roomID/users', rooms.getUsersInRoom)

    // router.get('/room/:roomID/messages', rooms.getMessages)
    // router.post('/room/:roomID/:userID/messages', rooms.postMessage)
    // router.get('/room/:roomID/:userID/messages', rooms.getMessagesFromUser)
}

export default (interactor) => {
    server = interactor
    return routes
}