const app = require("../app")
const supertest = require("supertest")

let tokenID, userID, tokenDate

/**
 * Token tests
 */

beforeAll(async (done) => {
    await supertest(app).post("/api/users")
        .send({ username: "adrian", password: "password1" })
        .set('Content-Type', 'application/json')
        .expect(200)
        .then((res) => {
            userID = res.userID
        })
    
    done()
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

test("GET /api/token/:tokenID", async () => {
    await supertest(app).get(`/api/token/${tokenID}`)
        .set('Token', tokenID)
        .expect(200)
        .then((res) => { 
            expect(res.body.token.id.length).toBe(36)
            expect(res.body.token.user).toBe(userID)
            tokenDate = res.body.token.expires
        })
})

test("PUT /api/token/:tokenID", async () => {
    await supertest(app).put(`/api/token/${tokenID}`)
        .set('Token', tokenID)
        .expect(200)
        .then((res) => { 
            expect(res.body.message).toBe("Session extended")
        })

    await supertest(app).get(`/api/token/${tokenID}`)
        .set('Token', tokenID)
        .expect(200)
        .then((res) => { 
            expect(res.body.token.expires).toBeGreaterThan(tokenDate)
        })
})