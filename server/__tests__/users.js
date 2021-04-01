const app = require("../app")
const supertest = require("supertest")

test("POST /api/user", async () => {  
    await supertest(app).post("/api/users")
        .send({ username: "adrian", password: "password1" })
        .set('Content-Type', 'application/json')
        .expect(200)
        .then((res) => {
            expect(res.body["message"]).toBe("User created")
        });
});