const mockingoose = require('mockingoose')
var httpMocks = require('node-mocks-http');
const Wallet = require('./wallet.model')
const { post, get } = require('./wallet.controller')

const mocks = [
    {
        "_id": "632262795bb58efd145caee3",
        "owner": "63190a6acf10c3930a8386be",
        "label": "Efectivo",
        "acum": 30000,
        "alias": "efv",
        "createDate": "2022-09-14T23:23:37.596",
        "__v": 0
    },
    {
        "_id": "633262795bb58efd145caee3",
        "owner": "63190a6acf10c3930a8386be",
        "label": "Mercado Pago",
        "acum": 0,
        "alias": "mp",
        "createDate": "2022-09-14T23:23:37.596",
        "__v": 0
    },
    {
        "_id": "634262795bb58efd145caee3",
        "owner": "63190a6acf10c3930a8386be",
        "label": "Uala",
        "acum": 76000,
        "alias": "uala",
        "createDate": "2022-09-14T23:23:37.596",
        "__v": 0
    }
]

describe('POST /wallets', () => {
    it('Should POST a new Wallet', async() => {
        // Mocking
        mockingoose(Wallet).toReturn(mocks[0], "save")
        const req = httpMocks.createRequest({
            body: {
                "label": "Efectivo",
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
        expect(res.statusCode).toEqual(201)
        expect(json.data.label).toEqual("Efectivo")
        expect(json.data.alias).toEqual("efv")
        expect(json.data.acum).toEqual(30000)
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
        mockingoose(Wallet).toReturn(mocks, 'find')
        mockingoose(Wallet).toReturn(3, 'count')
        const req = httpMocks.createRequest({
            query: { "page": null },
            id: "63190a6acf10c3930a8386be"
        })
        const res = httpMocks.createResponse()

        // Executing
        await get(req, res)

        // Testing
        const json = res._getJSONData()
        expect(res.statusCode).toEqual(200)
        expect(json.data.length).toEqual(3)
        expect(json.paging.previus).toEqual(null)
        expect(json.paging.next).toEqual(null)
    })
    it('Should GET Wallet list with pagging', async() => {
        // Mocking
        mockingoose(Wallet).toReturn([], 'find')
        mockingoose(Wallet).toReturn(3, 'count')
        const req = httpMocks.createRequest({
            query: { "page": 2 },
            id: "63190a6acf10c3930a8386be"
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