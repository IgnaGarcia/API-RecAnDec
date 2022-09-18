const Category = require('../category/category.model');
const Wallet = require('../wallet/wallet.model');
const Tag = require('../tag/tag.model');
const { getListOf } = require("../../utils/telegram.utils");

const sync = async(req, res) => {

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