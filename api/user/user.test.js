const mockingoose = require('mockingoose')
const httpMocks = require('node-mocks-http');
const User = require('./user.model')
const { userMock } = require('../../mocks/mocks')
const { register, login, refreshToken } = require('./user.controller')

describe('POST /register', () => {
    it('Should create new user', async () => {
        // Mocking
        mockingoose(User).toReturn(userMock, "save")
        const req = httpMocks.createRequest({
            body: { 
                email: userMock.email, 
                password: "123", 
                name: userMock.name
            },
        })
        const res = httpMocks.createResponse()

        // Executing
        await register(req, res)

        // Testing
        const json = res._getJSONData()
        expect(res.statusCode).toEqual(201)
        expect(json.data.email).toEqual(userMock.email)
        expect(json.data.password).not.toEqual("123")
        expect(json.token).not.toBeNull()
    })
    it('Should fail for empty email', async () => {
        // Mocking
        const req = httpMocks.createRequest({
            body: { 
                password: "123", 
                name: userMock.name
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
        mockingoose(User).toReturn(userMock, "findOne")
        const req = httpMocks.createRequest({
            body: { email: userMock.email, password: "123" },
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
        mockingoose(User).toReturn(userMock, "findOne")
        const req = httpMocks.createRequest({
            body: { email: userMock.email, password: "123456" },
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
        mockingoose(User).toReturn(userMock, "findOne")
        const req = httpMocks.createRequest({
            params: { id: userMock._id },
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