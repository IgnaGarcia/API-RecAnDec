const Limit = require('./limit.model');
const { getAcumOfPeriod } = require('../../utils/limit.utils');
const { findWithPaging, create, remove } = require('../../utils/mongoose.utils');

const post = async(req, res) => {
    console.log("[POST]: limit ")

    if(req.body && req.body.category && req.body.amount) {
        console.log("[BODY]: " + JSON.stringify(req.body) + "; [ID]: " + req.params.id)
        let today = new Date()
        let limit = new Limit({ owner: req.params.id, 
            month: today.getMonth()+1,
            year: today.getFullYear(),
            ...req.body })

        limit.acum = await getAcumOfPeriod(limit.owner, limit.category, limit.month, limit.year)
        await create(res, limit, "Limit")
    } else return res.status(400).json({ message: "Fields required are null" })
}

const get = async(req, res) => {
    console.log("[GET]: limits")
    const page = req.query.page ? Number(req.query.page) : 1

    let query = { 'owner': req.params.id }
    await findWithPaging(res, Limit, query, "Limits", { year: -1, month: -1 }, page)
}

const update = async(req, res) => {
    console.log("[PUT]: limit")
    if(req.params.id && req.params.limit && req.body.amount) {
        try {
            let limit = await Limit.findById(req.params.limit);
            console.log("[LIMIT]: " + limit)

            limit.amount = req.body.amount
            let today = new Date()
            if(limit.month != today.getMonth()+1){
                limit.month = today.getMonth()+1
                limit.acum = 0
            }
            if(limit.year != today.getFullYear()){
                limit.year = today.getFullYear()
                limit.acum = 0
            }
            console.log("[NEW LIMIT]: " + limit)
            await limit.save()
            res.status(200).json({
                message: "Limits updated successfully",
                data: limit
            });
        } catch (e) {
            console.error("[ERROR]: " + err)
            res.status(500).json({
                message: "Internal Server Error on Updating",
                code: err.code,
                error: err
            });
        }
    } else return res.status(400).json({ message: "Fields required are null" })
}

const erase = async(req, res) => {
    console.log("[DELETE]: limit")
    if(req.params.id && req.params.limit) {
        await remove(res, Limit, req.params.limit, "Limit")
    } else return res.status(400).json({ message: "Fields required are null" })
}

module.exports = { post, get, update, erase }