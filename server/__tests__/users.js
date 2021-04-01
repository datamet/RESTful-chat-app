const app = require("../app")
const supertest = require("supertest")

let tokenID, userID

/**
 * User tests
 */

test("POST /api/users", async () => {  
    await supertest(app).post("/api/users")
        .send({ username: "adrian", password: "password1" })
        .set('Content-Type', 'application/json')
        .expect(200)
        .then((res) => {
            expect(res.body.message).toBe("User created")
        })
})

test("POST /api/tokens", async () => {  
    await supertest(app).post("/api/tokens")
        .send({ username: "adrian", password: "password1" })
        .set('Content-Type', 'application/json')
        .expect(200)
        .then((res) => {
            expect(res.body.token.length).toBe(36)
            tokenID = res.body.token
        })
})

test("GET /api/users", async () => {  
    await supertest(app).get("/api/users")
        .set('Token', tokenID)
        .expect(200)
        .then((res) => {
            expect(res.body.users.length).toBe(1)
            expect(res.body.users[0].username).toBe("adrian")
            userID = res.body.users[0].id
        })
})

test("GET /api/user/:userID", async () => {  
    await supertest(app).get(`/api/user/${userID}`)
        .set('Token', tokenID)
        .expect(200)
        .then((res) => {
            expect(res.body.user.username).toBe("adrian")
        })
})

