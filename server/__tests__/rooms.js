const app = require("../app")
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
        .then((res) => {})
    
    await supertest(app).post("/api/tokens")
        .send({ username: "adrian", password: "password1" })
        .set('Content-Type', 'application/json')
        .expect(200)
        .then((res) => { tokenID = res.body.token })

    await supertest(app).get("/api/users")
        .set('Token', tokenID)
        .expect(200)
        .then((res) => { userID = res.body.users[0].id })
    
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
            expect(res.body.rooms[0].admin).toBe(userID)
            roomID = res.body.rooms[0].id
        })

    await supertest(app).get(`/api/users/${userID}`)
        .set('Token', tokenID)
        .expect(200)
        .then((res) => {
            expect(res.body.rooms[0]).toBe(roomID)
            expect(res.body.ownedRooms[0]).toBe(roomID)
        })
})

test("GET /api/rooms/:roomID", async () => {  
    await supertest(app).get(`/api/rooms/${roomID}`)
        .set('Token', tokenID)
        .expect(200)
        .then((res) => {
            expect(res.body.name).toBe("testroom")
            expect(res.body.admin).toBe(userID)
            expect(res.body.users[0]).toBe(userID)
        })
})

test("DELETE /api/rooms/:roomID", async () => {  
    await supertest(app).delete(`/api/rooms/${roomID}`)
        .set('Token', tokenID)
        .expect(200)
        .then((res) => {
            expect(res.body.message).toBe("Room deleted")
        })

    await supertest(app).get(`/api/users/${userID}`)
        .set('Token', tokenID)
        .expect(200)
        .then((res) => {
            expect(res.body.ownedRooms.length).toBe(0)
            expect(res.body.rooms.length).toBe(0)
        })
})