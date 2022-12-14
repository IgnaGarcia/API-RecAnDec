const Category = require('../category/category.model');
const Wallet = require('../wallet/wallet.model');
const Tag = require('../tag/tag.model');
const User = require("../user/user.model");
const Limit = require("../limit/limit.model");
const Command = require('../command/command.model');
const log = require('../../utils/log.utils')
const { getListOf } = require("../../utils/telegram.utils");
const { find } = require("../../utils/mongoose.utils");

const sync = async(req, res) => {
    if(req.params.telegramId && req.body && req.body.email && req.body.securityCode) {
        log.debug("SYNC TELEGRAM", req.params.telegramId)
        log.content(req.body, req.params.telegramId)

        let user = await User.findOne({ "telegramId": req.body.securityCode, "email": req.body.email })
        if(user && user.telegramId[0] == "_") {
            try {
                log.debug("USER FINDED", JSON.stringify(user))
                user.telegramId = req.params.telegramId
                await user.save()
                return res.status(200).json({
                    message: "User syncronized with telegram",
                    data: user
                })
            } catch(err) {
                return (err.code == 11000) ? res.status(406).json({
                    message: "Duplicate Key Error",
                    code: err.code,
                    error: err
                }) : "Internal Server Error on Saving"
                log.error(err)
        
                return res.status(500).json({
                    message,
                    code: err.code,
                    error: err
                });
            }
        } else return res.status(404).json({ message: "Invalid email or security code" })
    } else return res.status(400).json({ message: "Fields required are null" })
}

const commands = async(req, res) => {
    log.get("command from telegram")
    let user = await User.findOne({ "telegramId": req.params.telegramId })
    if(user) {
        log.debug("USER FINDED", JSON.stringify(user))
        let query = { 'owner': user._id }
        await find(res, Command, query, "Commands")
    } else return res.status(404).json({ message: "Invalid telegram id" })
}

const user = async(req, res) => {
    log.debug("GET USER", req.params.telegramId)

    let user = await User.findOne({ "telegramId": req.params.telegramId })
    if(user) {
        log.debug("USER FINDED", JSON.stringify(user))
        return res.status(200).json({
            message: "User finded with telegram",
            data: user
        })
    } else return res.status(404).json({ message: "Invalid telegram id" })
}

const wallets = async(req, res) => {
    await getListOf(res, Wallet, req.params.telegramId, "Wallets")
}

const categories = async(req, res) => {
    await getListOf(res, Category, req.params.telegramId, "Categories")
}

const tags = async(req, res) => {
    await getListOf(res, Tag, req.params.telegramId, "Tags")
}

const limits = async(req, res) => {
    await getListOf(res, Limit, req.params.telegramId, "Limits", "category")
}

module.exports = { sync, wallets, categories, tags, commands, limits, user };
