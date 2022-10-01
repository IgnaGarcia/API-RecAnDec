const mockingoose = require('mockingoose')
const httpMocks = require('node-mocks-http');
const Command = require('./command.model')
const { commandsMock } = require('../../mocks/mocks')
const { post, get, erase } = require('./command.controller');

describe('POST /commands', () => {
    it('Should create new command', async () => {
        mockingoose(Command).toReturn(commandsMock[0], "save")
        mockingoose(Command).toReturn(null, "findOne")
        const req = httpMocks.createRequest({
            id: limitsMock[0].owner,
            body: {
                expense: commandsMock[0].expense,
                category: commandsMock[0].category
            }
        })
        const res = httpMocks.createResponse()

        await post(req, res)

        const json = res._getJSONData()
        expect(res.statusCode).toEqual(201)
        expect(json.data.category).toEqual(commandsMock[0].category)
        expect(json.data.expense).toEqual(commandsMock[0].expense)
    })
    it('Should update existence command', async () => {
        mockingoose(Command).toReturn(commandsMock[0], "save")
        mockingoose(Command).toReturn(commandsMock[0], "findOne")
        const req = httpMocks.createRequest({
            id: limitsMock[0].owner,
            body: {
                expense: commandsMock[0].expense,
                category: commandsMock[0].category,
                tags: [],
                wallet: commandsMock[0].wallet
            }
        })
        const res = httpMocks.createResponse()

        await post(req, res)

        const json = res._getJSONData()
        expect(res.statusCode).toEqual(201)
        expect(json.data.category).toEqual(commandsMock[0].category)
        expect(json.data.expense).toEqual(commandsMock[0].expense)
    })
    it('Should thrown duplicate key error', async () => {
        mockingoose(Command).toReturn(commandsMock[0], "findOne")
        e = new Error("Duplicate key error")
        e.code = 11000
        mockingoose(Command).toReturn(e, "save")
        const req = httpMocks.createRequest({
            id: limitsMock[0].owner,
            body: {
                expense: commandsMock[0].expense,
                category: undefined,
                tags: undefined,
                wallet: undefined
            }
        })
        const res = httpMocks.createResponse()

        await post(req, res)

        const json = res._getJSONData()
        expect(res.statusCode).toEqual(500)
        expect(json.code).toEqual(11000)
    })
    it('Should fail on empty body', async () => {
        const req = httpMocks.createRequest({
            id: commandsMock[0].owner
        })
        const res = httpMocks.createResponse()

        await post(req, res)
        expect(res.statusCode).toEqual(400)
    })
})

describe('GET /commands', () => {
    it('Should GET Command list', async() => {
        mockingoose(Command).toReturn(commandsMock, 'find')
        const req = httpMocks.createRequest({
            id: limitsMock[0].owner
        })
        const res = httpMocks.createResponse()

        await get(req, res)

        const json = res._getJSONData()
        expect(res.statusCode).toEqual(200)
        expect(json.data.length).toEqual(commandsMock.length)
    })
})

describe('DELETE /commands/:commands', () => {
    it('Should DELETE Command by ID', async() => {
        mockingoose(Command).toReturn(commandsMock[0], 'findOneAndRemove')
        const req = httpMocks.createRequest({
            params: { "command": commandsMock[0]._id },
            id: commandsMock[0].owner
        })
        const res = httpMocks.createResponse()

        await erase(req, res)

        const json = res._getJSONData()
        expect(res.statusCode).toEqual(200)
        expect(json.data).toEqual(commandsMock[0]._id)
    })
})