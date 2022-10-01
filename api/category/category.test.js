const mockingoose = require('mockingoose')
const httpMocks = require('node-mocks-http');
const Category = require('./category.model')
const { categoriesMock } = require('../../mocks/mocks')
const { post, get } = require('./category.controller');

describe('POST /categories', () => {
    it('Should create new category', async () => {
        mockingoose(Category).toReturn(categoriesMock[0], "save")
        const req = httpMocks.createRequest({
            id: categoriesMock[0].owner,
            body: {
                label: categoriesMock[0].label,
                alias: categoriesMock[0].alias
            }
        })
        const res = httpMocks.createResponse()

        await post(req, res)

        const json = res._getJSONData()
        expect(res.statusCode).toEqual(201)
        expect(json.data.label).toEqual(categoriesMock[0].label)
        expect(json.data.alias).toEqual(categoriesMock[0].alias)
    })
    it('Should fail on empty body', async () => {
        const req = httpMocks.createRequest({
            id: categoriesMock[0].owner
        })
        const res = httpMocks.createResponse()

        await post(req, res)
        expect(res.statusCode).toEqual(400)
    })
})

describe('GET /categories', () => {
    it('Should GET Categories list', async() => {
        mockingoose(Category).toReturn(categoriesMock, 'find')
        const req = httpMocks.createRequest({
            id: categoriesMock[0].owner
        })
        const res = httpMocks.createResponse()

        await get(req, res)

        const json = res._getJSONData()
        expect(res.statusCode).toEqual(200)
        expect(json.data.length).toEqual(categoriesMock.length)
    })
    it('Should GET Categories list with pagging', async() => {
        mockingoose(Category).toReturn(categoriesMock, 'find')
        const req = httpMocks.createRequest({
            id: categoriesMock[0].owner,
            query: { page: 1 }
        })
        const res = httpMocks.createResponse()

        await get(req, res)

        const json = res._getJSONData()
        expect(res.statusCode).toEqual(200)
        expect(json.data.length).toEqual(categoriesMock.length)
    })
    it('Should fail with error', async() => {
        mockingoose(Category).toReturn(new Error(), 'find')
        const req = httpMocks.createRequest({
            id: categoriesMock[0].owner
        })
        const res = httpMocks.createResponse()

        await get(req, res)
        expect(res.statusCode).toEqual(500)
    })
})