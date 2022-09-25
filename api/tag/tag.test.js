const mockingoose = require('mockingoose')
const httpMocks = require('node-mocks-http');
const Tag = require('./tag.model')
const { tagsMock } = require('../../mocks/mocks')
const { post, get } = require('./tag.controller');

describe('POST /tags', () => {
    it('Should create new tag', async () => {
        mockingoose(Tag).toReturn(tagsMock, "save")
        const req = httpMocks.createRequest({
            id: tagsMock[0].owner,
            body: {
                label: tagsMock[0].label,
                alias: tagsMock[0].alias
            }
        })
        const res = httpMocks.createResponse()

        await post(req, res)

        const json = res._getJSONData()
        expect(res.statusCode).toEqual(201)
        expect(json.data.label).toEqual(tagsMock[0].label)
        expect(json.data.alias).toEqual(tagsMock[0].alias)
    })
    it('Should fail on empty label', async () => {
        const req = httpMocks.createRequest({
            id: tagsMock[0].owner,
            body: {
                alias: tagsMock[0].alias
            }
        })
        const res = httpMocks.createResponse()

        await post(req, res)

        const json = res._getJSONData()
        expect(res.statusCode).toEqual(400)
        expect(json.message).toEqual("Fields required are null")
    })
})

describe('GET /tags', () => {
    it('Should find tags', async () => {
        mockingoose(Tag).toReturn(tagsMock, "find")
        const req = httpMocks.createRequest({
            id: tagsMock[0].owner,
            query: { page: 1 }
        })
        const res = httpMocks.createResponse()

        await get(req, res)

        const json = res._getJSONData()
        expect(res.statusCode).toEqual(200)
        expect(json.data.length).toEqual(3)
    })
    it('Should find tags whitout page', async () => {
        mockingoose(Tag).toReturn(tagsMock, "find")
        const req = httpMocks.createRequest({
            id: tagsMock[0].owner
        })
        const res = httpMocks.createResponse()

        await get(req, res)

        const json = res._getJSONData()
        expect(res.statusCode).toEqual(200)
        expect(json.data.length).toEqual(3)
    })
})