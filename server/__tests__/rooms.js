const { app } = require("../app")
const supertest = require("supertest")

let tokenID, userID, roomID

/**
 * Room tests
 */

beforeAll(async (done) => {
    await supertest(app).post("/api/users")
        .send({ username: "adrian", password: "password1" })
        .set('Content-Type', 'application/json')
        .expect(200)
        .then((res) => { userID = res.body.userID })
    
    await supertest(app).post("/api/tokens")
        .send({ username: "adrian", password: "password1" })
        .set('Content-Type', 'application/json')
        .expect(200)
        .then((res) => { tokenID = res.body.token })
    
    done()
})

test("POST /api/rooms", async () => {  
    await supertest(app).post(`/api/rooms`)
        .send({ name: 'testroom' })
        .set('Token', tokenID)
        .expect(200)
        .then((res) => {
            expect(res.body.message).toBe("Room created")
        })
})

test("GET /api/rooms", async () => {  
    await supertest(app).get(`/api/rooms`)
        .set('Token', tokenID)
        .expect(200)
        .then((res) => {
            expect(res.body.rooms.length).toBe(1)
            expect(res.body.rooms[0].name).toBe('testroom')
            expect(res.body.rooms[0].admin).toBeUndefined()
            roomID = res.body.rooms[0].id
        })

    await supertest(app).get(`/api/user/${userID}`)
        .set('Token', tokenID)
        .expect(200)
        .then((res) => {
            expect(res.body.user.rooms[0]).toBe(roomID)
            expect(res.body.user.ownedRooms[0]).toBe(roomID)
        })
})

test("GET /api/room/:roomID", async () => {  
    await supertest(app).get(`/api/room/${roomID}`)
        .set('Token', tokenID)
        .expect(200)
        .then((res) => {
            expect(res.body.room.name).toBe("testroom")
            expect(res.body.room.admin).toBe(userID)
            expect(res.body.room.users[0]).toBe(userID)
        })
})

test("DELETE /api/room/:roomID", async () => {  
    await supertest(app).delete(`/api/room/${roomID}`)
        .set('Token', tokenID)
        .expect(200)
        .then((res) => {
            expect(res.body.message).toBe("Room deleted")
        })

    await supertest(app).get(`/api/user/${userID}`)
        .set('Token', tokenID)
        .expect(200)
        .then((res) => {
            expect(res.body.user.ownedRooms.length).toBe(0)
            expect(res.body.user.rooms.length).toBe(0)
        })
})