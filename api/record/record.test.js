const mockingoose = require('mockingoose')
const httpMocks = require('node-mocks-http');
const Record = require('./record.model')
const Limit = require('../limit/limit.model')
const { recordsMock, limitsMock } = require('../../mocks/mocks')
const { post, get, balance, summary, historical, update } = require('./record.controller');

describe('POST /record', () => {
    it('Should create new record', async () => {
        mockingoose(Record).toReturn(recordsMock[0], "save")
        mockingoose(Record).toReturn(recordsMock[0], "find")
        mockingoose(Limit).toReturn(limitsMock[0], "findOne")
        const req = httpMocks.createRequest({
            id: recordsMock[0].owner,
            body: {
                amount: recordsMock[0].amount,
                category: recordsMock[0].category
            }
        })
        const res = httpMocks.createResponse()

        await post(req, res)

        const json = res._getJSONData()
        expect(res.statusCode).toEqual(201)
        expect(json.data.record.amount).toEqual(recordsMock[0].amount)
        expect(json.data.record.category).toEqual(recordsMock[0].category)
    })
    it('Should fail when save', async () => {
        mockingoose(Record).toReturn(new Error("some err"), "save")
        const req = httpMocks.createRequest({
            id: recordsMock[0].owner,
            body: {
                amount: recordsMock[0].amount,
                category: recordsMock[0].category
            }
        })
        const res = httpMocks.createResponse()

        await post(req, res)
        expect(res.statusCode).toEqual(500)
    })
    it('Should fail on empty body', async () => {
        const req = httpMocks.createRequest({
            id: recordsMock[0].owner
        })
        const res = httpMocks.createResponse()

        await post(req, res)
        expect(res.statusCode).toEqual(400)
    })
})

describe('GET /records', () => {
    it('Should GET Records list', async() => {
        mockingoose(Record).toReturn(recordsMock, 'find')
        const req = httpMocks.createRequest({
            id: recordsMock[0].owner,
            body: {
                dateFrom: "2022-09-01",
                dateUntil: "2022-09-31",
                categories: [],
                tags: [],
                wallets: []
            }
        })
        const res = httpMocks.createResponse()

        await get(req, res)

        const json = res._getJSONData()
        expect(res.statusCode).toEqual(200)
        expect(json.data.length).toEqual(recordsMock.length)
    })
    it('Should GET Records list with pagging', async() => {
        mockingoose(Record).toReturn(recordsMock, 'find')
        const req = httpMocks.createRequest({
            id: categoriesMock[0].owner,
            query: { page: 1 }
        })
        const res = httpMocks.createResponse()

        await get(req, res)

        const json = res._getJSONData()
        expect(res.statusCode).toEqual(200)
        expect(json.data.length).toEqual(recordsMock.length)
    })
})

describe('PUT /records/:record', () => {
    it('Should UPDATE Record by ID', async() => {
        mockingoose(Record).toReturn(recordsMock[0], 'findOneAndUpdate')
        const req = httpMocks.createRequest({
            id: recordsMock[0].owner,
            params: { record: recordsMock[0]._id },
            body: {
                wallet: "632262795bb58efd145caee3",
                tags: ["63225edaa4d8591844853a24"]
            }
        })
        const res = httpMocks.createResponse()

        await update(req, res)
        expect(res.statusCode).toEqual(200)
    })
    it('Should fail on empty body', async() => {
        const req = httpMocks.createRequest({
            id: recordsMock[0].owner
        })
        const res = httpMocks.createResponse()

        await update(req, res)
        expect(res.statusCode).toEqual(400)
    })
    it('Should thrown error', async() => {
        mockingoose(Record).toReturn(new Error("some err"), 'findOneAndUpdate')
        const req = httpMocks.createRequest({
            id: recordsMock[0].owner,
            params: { record: recordsMock[0]._id },
            body: {
                wallet: "632262795bb58efd145caee3",
                tags: ["63225edaa4d8591844853a24"]
            }
        })
        const res = httpMocks.createResponse()

        await update(req, res)
        expect(res.statusCode).toEqual(500)
    })
})

describe('GET /records/balance', () => {
    it('Should calculate balance', async() => {
        let mockBalance = [
            {
                _id: { year: "2022", month: "9" },
                income: 30,
                expense: 100,
                countIncome: 1,
                countExpense: 5
            },
            {
                _id: { year: "2022", month: "8" },
                income: 20,
                expense: 500,
                countIncome: 1,
                countExpense: 15
            }
        ]
        mockingoose(Record).toReturn(mockBalance, 'aggregate')
        const req = httpMocks.createRequest({
            id: recordsMock[0].owner,
            query: { 
                dateFrom: "2022-08-01",
                dateUntil: "2022-09-31"
            }
        })
        const res = httpMocks.createResponse()

        await balance(req, res)

        const json = res._getJSONData()
        expect(res.statusCode).toEqual(200)
        expect(json.data.length).toEqual(3)
    })
    it('Should thrown error', async() => {
        mockingoose(Record).toReturn(new Error("some err"), 'aggregate')
        const req = httpMocks.createRequest({
            id: recordsMock[0].owner,
            query: { 
                dateFrom: "2022-08-01",
                dateUntil: "2022-09-31"
            }
        })
        const res = httpMocks.createResponse()

        await balance(req, res)
        expect(res.statusCode).toEqual(500)
    })
    it('Should fail for empty owner', async() => {
        const req = httpMocks.createRequest({
            query: { 
                dateFrom: "2022-08-01",
                dateUntil: "2022-09-31"
            }
        })
        const res = httpMocks.createResponse()

        await balance(req, res)
        expect(res.statusCode).toEqual(500)
    })
})

describe('GET /records/summary/:groupBy', () => {
    it('Should calculate summary', async() => {
        let mockBalance = [
            {
                _id: { key: "63190ab3cf10c3930a8386bf", label: "Alimentos" },
                acum: 7000,
                count: 2
            },
            {
                _id: { key: "63290ab3cf10c3930a8386bf", label: "Impuestos" },
                acum: 13000,
                count: 6
            }
        ]
        mockingoose(Record).toReturn(mockBalance, 'aggregate')
        const req = httpMocks.createRequest({
            id: recordsMock[0].owner,
            params: { groupBy: "category" },
            query: { 
                filter: ["63190ab3cf10c3930a8386bf", "63290ab3cf10c3930a8386bf"],
                dateFrom: "2022-08-01",
                dateUntil: "2022-09-31"
            }
        })
        const res = httpMocks.createResponse()

        await summary(req, res)

        const json = res._getJSONData()
        expect(res.statusCode).toEqual(200)
        expect(json.data.length).toEqual(2)
    })
    it('Should fail when aggregate', async() => {
        mockingoose(Record).toReturn(new Error("some error"), 'aggregate')
        const req = httpMocks.createRequest({
            id: recordsMock[0].owner,
            params: { groupBy: "category" },
            query: { 
                filter: ["63190ab3cf10c3930a8386bf", "63290ab3cf10c3930a8386bf"],
                dateFrom: "2022-08-01",
                dateUntil: "2022-09-31"
            }
        })
        const res = httpMocks.createResponse()

        await summary(req, res)
        expect(res.statusCode).toEqual(500)
    })
    it('Should fail on empty fields', async() => {
        const req = httpMocks.createRequest({
            id: recordsMock[0].owner,
            query: { 
                filter: ["63190ab3cf10c3930a8386bf", "63290ab3cf10c3930a8386bf"]
            }
        })
        const res = httpMocks.createResponse()

        await summary(req, res)
        expect(res.statusCode).toEqual(400)
    })
})

// TODO calc historical
describe('GET /records/historical/:groupBy', () => {
    let commonMockBalance = [
        {
            _id: {
                key: "63190ab3cf10c3930a8386bf",
                label: "Alimentos",
                year: "2022", month: "9"
            },
            acum: 300, 
            count: 2
        },
        {
            _id: {
                key: "63190ab3cf10c3930a8386bf",
                label: "Alimentos",
                year: "2022", month: "8"
            },
            acum: 700, 
            count: 4
        },
        {
            _id: {
                key: "63290ab3cf10c3930a8386bf",
                label: "Impuestos",
                year: "2022", month: "8"
            },
            acum: 7000, 
            count: 4
        }
    ]
    it('Should calculate historical', async() => {
        mockingoose(Record).toReturn(commonMockBalance, 'aggregate')
        const req = httpMocks.createRequest({
            id: recordsMock[0].owner,
            params: { groupBy: "category" },
            query: { 
                filter: ["63190ab3cf10c3930a8386bf", "63290ab3cf10c3930a8386bf", "63390ab3cf10c3930a8386bf"]
            }
        })
        const res = httpMocks.createResponse()

        await historical(req, res)

        const json = res._getJSONData()
        expect(res.statusCode).toEqual(200)
        expect(json.data.Alimentos.length).toEqual(2)
        expect(json.data.Impuestos.length).toEqual(1)
    })
    it('Should calculate historical', async() => {
        mockingoose(Record).toReturn(commonMockBalance, 'aggregate')
        const req = httpMocks.createRequest({
            id: recordsMock[0].owner,
            params: { groupBy: "tags" },
            query: { 
                filter: ["63190ab3cf10c3930a8386bf", "63290ab3cf10c3930a8386bf", "63390ab3cf10c3930a8386bf"]
            }
        })
        const res = httpMocks.createResponse()

        await historical(req, res)

        const json = res._getJSONData()
        expect(res.statusCode).toEqual(200)
        expect(json.data.Alimentos.length).toEqual(2)
        expect(json.data.Impuestos.length).toEqual(1)
    })
    it('Should calculate historical', async() => {
        mockingoose(Record).toReturn(commonMockBalance, 'aggregate')
        const req = httpMocks.createRequest({
            id: recordsMock[0].owner,
            params: { groupBy: "wallet" },
            query: { 
                filter: ["63190ab3cf10c3930a8386bf", "63290ab3cf10c3930a8386bf", "63390ab3cf10c3930a8386bf"]
            }
        })
        const res = httpMocks.createResponse()

        await historical(req, res)

        const json = res._getJSONData()
        expect(res.statusCode).toEqual(200)
        expect(json.data.Alimentos.length).toEqual(2)
        expect(json.data.Impuestos.length).toEqual(1)
    })
    it('Should calculate historical of isOut', async() => {
        let mockBalance = [
            {
                _id: {
                    key: "isOut",
                    label: "true",
                    year: "2022", month: "9"
                },
                acum: 300, 
                count: 2
            },
            {
                _id: {
                    key: "isOut",
                    label: "true",
                    year: "2022", month: "8"
                },
                acum: 700, 
                count: 4
            },
            {
                _id: {
                    key: "isOut",
                    label: "false",
                    year: "2022", month: "8"
                },
                acum: 7000, 
                count: 4
            }
        ]
        mockingoose(Record).toReturn(mockBalance, 'aggregate')
        const req = httpMocks.createRequest({
            id: recordsMock[0].owner,
            params: { groupBy: "isOut" },
            query: { 
                filter: []
            }
        })
        const res = httpMocks.createResponse()

        await historical(req, res)

        const json = res._getJSONData()
        expect(res.statusCode).toEqual(200)
        expect(json.data.true.length).toEqual(2)
        expect(json.data.false.length).toEqual(1)
    })
    it('Should fail on empty groupBy', async() => {
        const req = httpMocks.createRequest({
            id: recordsMock[0].owner
        })
        const res = httpMocks.createResponse()

        await historical(req, res)
        expect(res.statusCode).toEqual(400)
    })
    it('Should fail on aggregate', async() => {
        mockingoose(Record).toReturn(new Error("some error"), 'aggregate')
        const req = httpMocks.createRequest({
            id: recordsMock[0].owner,
            params: { groupBy: "category" },
            query: { 
                filter: ["63190ab3cf10c3930a8386bf", "63290ab3cf10c3930a8386bf", "63390ab3cf10c3930a8386bf"]
            }
        })
        const res = httpMocks.createResponse()

        await historical(req, res)
        expect(res.statusCode).toEqual(500)
    })
})
