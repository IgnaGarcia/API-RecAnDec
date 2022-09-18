const Wallet = require('./wallet.model');
const { create, findWithPaging } = require('../../utils/mongoose.utils');

const post = async(req, res) => {
    console.log("[POST]: wallet ")

    if(req.body && req.body.label && req.body.alias && req.body.acum) {
        console.log("[BODY]: " + JSON.stringify(req.body) + "; [ID]: " + req.params.id)
        let wallet = new Wallet({ owner: req.params.id, ...req.body })

        await create(res, wallet, "Wallet")
    } else return res.status(400).json({ message: "Fields required are null" })
}

const get = async(req, res) => {
    console.log("[GET]: wallets")
    const page = req.query.page ? Number(req.query.page) : 1

    let query = { 'owner': req.params.id }
    await findWithPaging(res, Wallet, query, "Wallets", { createDate: -1 }, page)
}

module.exports = { post, get }