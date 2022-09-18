const Category = require('../category/category.model');
const Wallet = require('../wallet/wallet.model');
const Tag = require('../tag/tag.model');
const User = require("../user/user.model");
const { getListOf } = require("../../utils/telegram.utils");

const sync = async(req, res) => {
    if(req.params.telegramId && req.body && req.body.email && req.body.securityCode) {
        console.log("[SYNC TELEGRAM]: " + JSON.stringify(req.body) + "; TG-ID: " + req.params.telegramId)

        let user = await User.findOne({ "telegramId": req.body.securityCode, "email": req.body.email })
        if(user) {
            console.log("[USER FINDED]: " + JSON.stringify(user))
            user.telegramId = req.params.telegramId
            await user.save()
            return res.status(200).json({
                message: "User syncronized with telegram",
                data: user
            })
        } else return res.status(404).json({ message: "Invalid email or security code" })
    } else return res.status(400).json({ message: "Fields required are null" })
}

const wallets = async(req, res) => {
    getListOf(res, Wallet, req.params.telegramId, "Wallets")
}

const categories = async(req, res) => {
    getListOf(res, Category, req.params.telegramId, "Categories")
}

const tags = async(req, res) => {
    getListOf(res, Tag, req.params.telegramId, "Tags")
}

module.exports = { sync, wallets, categories, tags };