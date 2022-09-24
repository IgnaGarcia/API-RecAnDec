const mockingoose = require('mockingoose')
var httpMocks = require('node-mocks-http');
const User = require('./user.model')
const { register, login, refreshToken } = require('./user.controller')

const mocks = {
    "_id": "63190a6acf10c3930a8386be",
    "email": "gnachoxp@gmail.com",
    "password": "$2b$12$zYXkE639r0L.JlYVqYM1pODUXeknllVEB0YqZIhhX8HINF8yKpHXS",
    "name": "Igna Garcia",
    "telegramId": "982840555"
}

describe('POST /register', () => {
    it('Should create new user', async () => {
        // Mocking
        mockingoose(User).toReturn(mocks, "save")
        const req = httpMocks.createRequest({
            body: { 
                email: mocks.email, 
                password: "123", 
                name: mocks.name
            },
        })
        const res = httpMocks.createResponse()

        // Executing
        await register(req, res)

        // Testing
        const json = res._getJSONData()
        expect(res.statusCode).toEqual(201)
        expect(json.data.email).toEqual(mocks.email)
        expect(json.data.password).not.toEqual("123")
        expect(json.token).not.toBeNull()
    })
    it('Should fail for empty email', async () => {
        // Mocking
        const req = httpMocks.createRequest({
            body: { 
                password: "123", 
                name: mocks.name
            },
        })
        const res = httpMocks.createResponse()

        // Executing
        await register(req, res)

        // Testing
        const json = res._getJSONData()
        expect(res.statusCode).toEqual(400)
    })
})

describe('POST /login', () => {
    it('Should verify password and generate new token', async () => {
        // Mocking
        mockingoose(User).toReturn(mocks, "findOne")
        const req = httpMocks.createRequest({
            body: { email: mocks.email, password: "123" },
        })
        const res = httpMocks.createResponse()

        // Executing
        await login(req, res)

        // Testing
        const json = res._getJSONData()
        expect(res.statusCode).toEqual(200)
        expect(json.token).not.toBeNull()
    })
    it('Should fail on verify password', async () => {
        // Mocking
        mockingoose(User).toReturn(mocks, "findOne")
        const req = httpMocks.createRequest({
            body: { email: mocks.email, password: "123456" },
        })
        const res = httpMocks.createResponse()

        // Executing
        await login(req, res)

        // Testing
        const json = res._getJSONData()
        expect(res.statusCode).toEqual(403)
        expect(json.token).not.toBeNull()
    })
    it('Should fail email empty', async () => {
        // Mocking
        const req = httpMocks.createRequest({
            body: { password: "123456" },
        })
        const res = httpMocks.createResponse()

        // Executing
        await login(req, res)

        // Testing
        expect(res.statusCode).toEqual(400)
    })
})

describe('GET /:id/refresh', () => {
    it('Should generate new token', async () => {
        // Mocking
        mockingoose(User).toReturn(mocks, "findOne")
        const req = httpMocks.createRequest({
            params: { id: mocks._id },
        })
        const res = httpMocks.createResponse()

        // Executing
        await refreshToken(req, res)

        // Testing
        const json = res._getJSONData()
        expect(res.statusCode).toEqual(201)
        expect(json.token).not.toBeNull()
    })
})