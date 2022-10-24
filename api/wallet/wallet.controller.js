const Wallet = require('./wallet.model');
const log = require('../../utils/log.utils')
const { create, find } = require('../../utils/mongoose.utils');

const post = async(req, res) => {
    log.post("wallet")

    if(req.body && req.body.label && req.body.alias && (req.body.acum != undefined && req.body.acum != null)) {
        log.content(req.body, req.id)
        let wallet = new Wallet({ owner: req.id, ...req.body })

        await create(res, wallet, "Wallet")
    } else return res.status(400).json({ message: "Fields required are null" })
}

const get = async(req, res) => {
    log.get("wallets")

    let query = { 'owner': req.id }
    await find(res, Wallet, query, "Wallets", { createDate: -1 })
}

module.exports = { post, get }