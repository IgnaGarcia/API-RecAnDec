const mockingoose = require('mockingoose')
const httpMocks = require('node-mocks-http');
const Wallet = require('./wallet.model')
const { walletsMock } = require('../../mocks/mocks')
const { post, get } = require('./wallet.controller')

describe('POST /wallets', () => {
    it('Should POST a new Wallet', async() => {
        // Mocking
        mockingoose(Wallet).toReturn(walletsMock[0], "save")
        const req = httpMocks.createRequest({
            body: {
                "label": walletsMock[0].label,
                "acum": walletsMock[0].acum,
                "alias": walletsMock[0].alias,
            },
            id: walletsMock[0].owner
        })
        const res = httpMocks.createResponse()

        // Executing
        await post(req, res)

        // Testing
        const json = res._getJSONData()
        expect(res.statusCode).toEqual(201)
        expect(json.data.label).toEqual(walletsMock[0].label)
        expect(json.data.alias).toEqual(walletsMock[0].alias)
        expect(json.data.acum).toEqual(walletsMock[0].acum)
    })
    it('Should FAIL with empty label', async() => {
        const req = httpMocks.createRequest({
            body: {
                "acum": 30000,
                "alias": "efv",
            },
            id: "63190a6acf10c3930a8386be"
        })
        const res = httpMocks.createResponse()

        // Executing
        await post(req, res)

        // Testing
        const json = res._getJSONData()
        expect(res.statusCode).toEqual(400)
        expect(json.message).toEqual("Fields required are null")
    })
})

describe('GET /wallets', () => {
    it('Should GET Wallet list', async() => {
        // Mocking
        mockingoose(Wallet).toReturn(walletsMock, 'find')
        mockingoose(Wallet).toReturn(3, 'count')
        const req = httpMocks.createRequest({
            query: { "page": null },
            id: walletsMock[0].owner
        })
        const res = httpMocks.createResponse()

        // Executing
        await get(req, res)

        // Testing
        const json = res._getJSONData()
        expect(res.statusCode).toEqual(200)
        expect(json.data.length).toEqual(walletsMock.length)
        expect(json.paging.previus).toEqual(null)
        expect(json.paging.next).toEqual(null)
    })
    it('Should GET Wallet list with pagging', async() => {
        // Mocking
        mockingoose(Wallet).toReturn([], 'find')
        mockingoose(Wallet).toReturn(3, 'count')
        const req = httpMocks.createRequest({
            query: { "page": 2 },
            id: walletsMock[0].owner
        })
        const res = httpMocks.createResponse()

        // Executing
        await get(req, res)

        // Testing
        const json = res._getJSONData()
        expect(res.statusCode).toEqual(200)
        expect(json.data.length).toEqual(0)
        expect(json.paging.previus).toEqual(1)
        expect(json.paging.next).toEqual(null)
    })
})