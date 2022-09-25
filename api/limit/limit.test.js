const mockingoose = require('mockingoose')
const httpMocks = require('node-mocks-http');
const Limit = require('../limit/limit.model')
const Record = require('../record/record.model')
const { limitsMock } = require('../../mocks/mocks')
const { post, get, update, erase } = require('./limit.controller');

describe('POST /limits', () => {
    it('Should create new limit', async () => {
        mockingoose(Limit).toReturn(limitsMock[0], "save")
        mockingoose(Record).toReturn([], "aggregate")
        const req = httpMocks.createRequest({
            id: limitsMock[0].owner,
            body: {
                category: limitsMock[0].category,
                amount: limitsMock[0].amount
            }
        })
        const res = httpMocks.createResponse()

        await post(req, res)

        const json = res._getJSONData()
        expect(res.statusCode).toEqual(201)
        expect(json.data.category).toEqual(limitsMock[0].category)
        expect(json.data.amount).toEqual(limitsMock[0].amount)
        expect(json.data.acum).toEqual(0)
    })
    it('Should create new limit with acum', async () => {
        mockingoose(Limit).toReturn(limitsMock[0], "save")
        mockingoose(Record).toReturn([{
            "_id": { "month": 9, "year": 2022 },
            "acum": 100
        }], "aggregate")
        const req = httpMocks.createRequest({
            id: limitsMock[0].owner,
            body: {
                category: limitsMock[0].category,
                amount: limitsMock[0].amount
            }
        })
        const res = httpMocks.createResponse()

        await post(req, res)

        const json = res._getJSONData()
        expect(res.statusCode).toEqual(201)
        expect(json.data.category).toEqual(limitsMock[0].category)
        expect(json.data.amount).toEqual(limitsMock[0].amount)
        expect(json.data.acum).toEqual(100)
    })
    it('Should fail on empty body', async () => {
        const req = httpMocks.createRequest({
            id: limitsMock[0].owner,
            body: {
                amount: limitsMock[0].amount
            }
        })
        const res = httpMocks.createResponse()

        await post(req, res)

        const json = res._getJSONData()
        expect(res.statusCode).toEqual(400)
    })
})

describe('GET /limits', () => {
    it('Should GET Limit list', async() => {
        mockingoose(Limit).toReturn(limitsMock, 'find')
        mockingoose(Limit).toReturn(3, 'count')
        const req = httpMocks.createRequest({
            query: { "page": null },
            id: limitsMock[0].owner
        })
        const res = httpMocks.createResponse()

        // Executing
        await get(req, res)

        // Testing
        const json = res._getJSONData()
        expect(res.statusCode).toEqual(200)
        expect(json.data.length).toEqual(limitsMock.length)
        expect(json.paging.previus).toEqual(null)
        expect(json.paging.next).toEqual(null)
    })
    it('Should GET Limit list with pagging', async() => {
        mockingoose(Limit).toReturn([], 'find')
        mockingoose(Limit).toReturn(3, 'count')
        const req = httpMocks.createRequest({
            query: { "page": 2 },
            id: limitsMock[0].owner
        })
        const res = httpMocks.createResponse()

        await get(req, res)

        const json = res._getJSONData()
        expect(res.statusCode).toEqual(200)
        expect(json.data.length).toEqual(0)
        expect(json.paging.previus).toEqual(1)
        expect(json.paging.next).toEqual(null)
    })
})

describe('PUT /limits/:limit', () => {
    it('Should UPDATE Limit by ID', async() => {
        mockingoose(Limit).toReturn(limitsMock[0], 'findOne')
        mockingoose(Limit).toReturn(limitsMock[0], 'save')
        const req = httpMocks.createRequest({
            params: { "limit": limitsMock[0]._id },
            id: limitsMock[0].owner,
            body: { amount: 500 }
        })
        const res = httpMocks.createResponse()

        await update(req, res)

        const json = res._getJSONData()
        expect(res.statusCode).toEqual(200)
        expect(json.data._id).toEqual(limitsMock[0]._id)
        expect(json.data.amount).toEqual(500)
    })
    it('Should UPDATE Limit with old date', async() => {
        mockingoose(Limit).toReturn(limitsMock[1], 'findOne')
        mockingoose(Limit).toReturn(limitsMock[1], 'save')
        const req = httpMocks.createRequest({
            params: { "limit": limitsMock[1]._id },
            id: limitsMock[1].owner,
            body: { amount: 500 }
        })
        const res = httpMocks.createResponse()

        await update(req, res)

        const json = res._getJSONData()
        let today = new Date()
        expect(res.statusCode).toEqual(200)
        expect(json.data.amount).toEqual(500)
        expect(json.data.acum).toEqual(0)
        expect(json.data.month).toEqual(today.getMonth()+1)
        expect(json.data.year).toEqual(today.getFullYear())
    })
    it('Should fail on empty amount', async() => {
        const req = httpMocks.createRequest({
            params: { "limit": limitsMock[0]._id },
            id: limitsMock[0].owner
        })
        const res = httpMocks.createResponse()

        await update(req, res)
        expect(res.statusCode).toEqual(400)
    })
    it('Should fail on limit not found', async() => {
        mockingoose(Limit).toReturn(null, 'findOne')
        const req = httpMocks.createRequest({
            params: { "limit": limitsMock[0]._id },
            id: limitsMock[0].owner,
            body: { amount: 500 }
        })
        const res = httpMocks.createResponse()

        await update(req, res)
        expect(res.statusCode).toEqual(500)
    })
})

describe('DELETE /limits/:limit', () => {
    it('Should DELETE Limit by ID', async() => {
        mockingoose(Limit).toReturn(limitsMock[0], 'findOneAndRemove')
        const req = httpMocks.createRequest({
            params: { "limit": limitsMock[0]._id },
            id: limitsMock[0].owner
        })
        const res = httpMocks.createResponse()

        await erase(req, res)

        const json = res._getJSONData()
        expect(res.statusCode).toEqual(200)
        expect(json.data).toEqual(limitsMock[0]._id)
    })
})