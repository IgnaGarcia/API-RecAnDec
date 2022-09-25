const mockingoose = require('mockingoose')
const httpMocks = require('node-mocks-http');
const User = require('../user/user.model')
const Command = require('../command/command.model')
const Wallet = require('../wallet/wallet.model')
const Category = require('../category/category.model')
const Tag = require('../tag/tag.model')
const { userMock, walletsMock, commandsMock, categoriesMock, tagsMock } = require('../../mocks/mocks')
const { sync, commands, wallets, categories, tags } = require('./telegram.controller')

describe('POST /:telegramId', () => {
    it('Should Validate TelegramId an set it', async () => {
        mockingoose(User).toReturn(userMock, "findOne")
        mockingoose(User).toReturn(userMock, "save")
        const req = httpMocks.createRequest({
            params: { telegramId: "44778822" },
            body: {
                email: userMock.email,
                securityCode: userMock.telegramId
            }
        })
        const res = httpMocks.createResponse()

        await sync(req, res)

        const json = res._getJSONData()
        expect(res.statusCode).toEqual(200)
        expect(json.data.telegramId).toEqual("44778822")
        expect(json.data.password).not.toEqual("123")
    })
    it('Should not found user', async () => {
        mockingoose(User).toReturn(null, "findOne")
        const req = httpMocks.createRequest({
            params: { telegramId: "44778822" },
            body: {
                email: userMock.email,
                securityCode: userMock.telegramId
            }
        })
        const res = httpMocks.createResponse()

        await sync(req, res)

        const json = res._getJSONData()
        expect(res.statusCode).toEqual(404)
        expect(json.message).toEqual("Invalid email or security code")
    })
    it('Should fail for empty data', async () => {
        mockingoose(User).toReturn(userMock, "findOne")
        const req = httpMocks.createRequest({
            params: { telegramId: "44778822" },
            body: {
                securityCode: userMock.telegramId
            }
        })
        const res = httpMocks.createResponse()

        await sync(req, res)

        const json = res._getJSONData()
        expect(res.statusCode).toEqual(400)
        expect(json.message).toEqual("Fields required are null")
    })
})

describe('GET /:telegramId/commands', () => {
    it('Should find commands', async () => {
        mockingoose(Command).toReturn(commandsMock, "find")
        const req = httpMocks.createRequest({
            params: { telegramId: "44778822" }
        })
        const res = httpMocks.createResponse()

        await commands(req, res)

        const json = res._getJSONData()
        expect(res.statusCode).toEqual(200)
        expect(json.data.length).toEqual(2)
    })
})

describe('GET /:telegramId/wallets', () => {
    it('Should find wallets', async () => {
        mockingoose(User).toReturn(userMock, "find")
        mockingoose(Wallet).toReturn(walletsMock, "find")
        const req = httpMocks.createRequest({
            params: { telegramId: "44778822" }
        })
        const res = httpMocks.createResponse()

        await wallets(req, res)
        expect(res.statusCode).toEqual(200)
    })
    it('Should not found user', async () => {
        mockingoose(User).toReturn(null, "find")
        const req = httpMocks.createRequest({
            params: { telegramId: "44778822" }
        })
        const res = httpMocks.createResponse()

        await wallets(req, res)
        expect(res.statusCode).toEqual(404)
    })
})

describe('GET /:telegramId/categories', () => {
    it('Should find categories', async () => {
        mockingoose(User).toReturn(userMock, "find")
        mockingoose(Category).toReturn(categoriesMock, "find")
        const req = httpMocks.createRequest({
            params: { telegramId: "44778822" }
        })
        const res = httpMocks.createResponse()

        await categories(req, res)
        expect(res.statusCode).toEqual(200)
    })
})

describe('GET /:telegramId/tags', () => {
    it('Should find tags', async () => {
        mockingoose(User).toReturn(userMock, "find")
        mockingoose(Tag).toReturn(tagsMock, "find")
        const req = httpMocks.createRequest({
            params: { telegramId: "44778822" }
        })
        const res = httpMocks.createResponse()

        await tags(req, res)
        expect(res.statusCode).toEqual(200)
    })
})