const Limit = require('./limit.model');
const { getWithPaging } = require('../../utils/paging.utils');
const { getAcumOfPeriod } = require('../../utils/limit.utils');

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
        console.log("[LIMIT]: " + limit)
  
        try {
            await limit.save()
            console.log("[LIMIT CREATED]: " + limit)
            res.status(201).json({
                message: "Limit created successfully",
                data: limit
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
    console.log("[GET]: limits")
    const page = req.query.page ? Number(req.query.page) : 1

    let query = { 'owner': req.params.id }
    console.log(`[QUERY]: ${JSON.stringify(query)}`)

    try {
        const paginatedResponse = await getWithPaging(Limit, query, { year: -1, month: -1 }, page)

        console.log(`[LIMITS FINDED]: ${paginatedResponse.data.length}`)
        res.status(200).json({
            message: "Limits finded successfully",
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
                error: err
            });
        }
    } else return res.status(400).json({ message: "Fields required are null" })
}

const erase = async(req, res) => {
    console.log("[DELETE]: limit")
    if(req.params.id && req.params.limit) {
        try {
            await Limit.findByIdAndDelete(req.params.limit);
            res.status(200).json({
                message: "Limits deleted successfully",
                data: req.params.limit
            });
        } catch (e) {
            console.error("[ERROR]: " + err)
            res.status(500).json({
                message: "Internal Server Error on Deleting",
                error: err
            });
        }
    } else return res.status(400).json({ message: "Fields required are null" })
}

module.exports = { post, get, update, erase }