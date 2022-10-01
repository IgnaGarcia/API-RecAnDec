const mockingoose = require('mockingoose')
const httpMocks = require('node-mocks-http');
const User = require('./user.model')
const { userMock } = require('../../mocks/mocks')
const { register, login, refreshToken } = require('./user.controller');

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
        expect(res.statusCode).toEqual(400)
    })
    it('Should fail for error in mongoose', async() => {
        mockingoose(User).toReturn(new Error("some err"), 'save')
        const req = httpMocks.createRequest({
            body: { 
                email: userMock.email, 
                password: "123", 
                name: userMock.name
            },
        })
        const res = httpMocks.createResponse()

        await register(req, res)
        expect(res.statusCode).toEqual(500)
    })
    it('Should fail for duplicate key', async() => {
        e = new Error("Duplicate key error")
        e.code = 11000
        mockingoose(User).toReturn(e, 'save')
        const req = httpMocks.createRequest({
            body: { 
                email: userMock.email, 
                password: "123", 
                name: userMock.name
            },
        })
        const res = httpMocks.createResponse()

        await register(req, res)
        expect(res.statusCode).toEqual(500)
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
    it('Should fail on user not found', async() => {
        mockingoose(User).toReturn(null, 'findOne')
        const req = httpMocks.createRequest({
            body: { email: userMock.email, password: "123456" },
        })
        const res = httpMocks.createResponse()

        await login(req, res)
        expect(res.statusCode).toEqual(500)
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
    it('Should fail on user not found', async() => {
        mockingoose(User).toReturn(null, 'findOne')
        const req = httpMocks.createRequest({
            params: { id: userMock._id },
        })
        const res = httpMocks.createResponse()

        await refreshToken(req, res)
        expect(res.statusCode).toEqual(404)
    })
    it('Should fail on mongoose error', async() => {
        mockingoose(User).toReturn(new Error("some err"), 'findOne')
        const req = httpMocks.createRequest({
            params: { id: userMock._id },
        })
        const res = httpMocks.createResponse()

        await refreshToken(req, res)
        expect(res.statusCode).toEqual(500)
    })
})