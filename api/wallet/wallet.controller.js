const Wallet = require('./wallet.model');
const { getWithPaging } = require('../../utils/paging.utils');

const post = async(req, res) => {
    console.log("[POST]: wallet ")

    if(req.body && req.body.label && req.body.alias && req.body.acum) {
        console.log("[BODY]: " + JSON.stringify(req.body) + "; [ID]: " + req.params.id)
        let wallet = new Wallet({ owner: req.params.id, ...req.body })
        wallet.createDate = new Date().toISOString()
        console.log("[WALLET]: " + wallet)
  
        try {
            await wallet.save()
            console.log("[WALLET CREATED]: " + wallet)
            res.status(201).json({
                message: "Wallet created successfully",
                data: wallet
            });
        } catch(err) {
            let message = (err.code == 11000) ? "Duplicate Key Error" : "Internal Server Error on Saving"
            console.log("[ERROR]: " + err)
            res.status(500).json({
                message,
                code: err.code,
                error: err
            });
        }
    } else return res.status(400).json({ message: "Fields required are null" })
}

const get = async(req, res) => {
    console.log("[GET]: wallets")
    const page = req.query.page ? Number(req.query.page) : 1

    let query = { 'owner': req.params.id }
    console.log(`[QUERY]: ${JSON.stringify(query)}`)

    try {
        const paginatedResponse = await getWithPaging(Wallet, query, { createDate: -1 }, page)

        console.log(`[WALLETS FINDED]: ${paginatedResponse.data.length}`)
        res.status(200).json({
            message: "Wallets finded successfully",
            ...paginatedResponse
        });
    } catch (err) {
        console.error("[ERROR]: " + err)
        res.status(500).json({
            message: "Internal Server Error on Finding",
            error: err
        });
    }
}

module.exports = { post, get }