const Limit = require('./limit.model');
const { getWithPaging } = require('../../utils/paging.utils');
const { getAcumOfPeriod } = require('../../utils/limit.utils');

const post = async(req, res) => {
    console.log("[POST]: limit ")

    if(req.body && req.body.category && req.body.amount) {
        console.log("[BODY]: " + JSON.stringify(req.body) + "; [ID]: " + req.params.id)
        let today = new Date()
        let limit = new Limit({ owner: req.params.id, 
            month: today.getMonth(),
            year: today.getFullYear(),
            ...req.body })

        let acum = await getAcumOfPeriod(limit.owner, limit.category, limit.month, limit.year)
        console.log("[LIMIT]: " + limit + " " + acum)
  
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
    console.log("[GET]: categories")
    const page = req.query.page ? Number(req.query.page) : 1

    let query = { $or: [{ 'owner': req.params.id }, { 'owner': null }] }
    console.log(`[QUERY]: ${JSON.stringify(query)}`)

    try {
        const paginatedResponse = await getWithPaging(Category, query, { createDate: -1 }, page)

        console.log(`[CATEGORIES FINDED]: ${paginatedResponse.data.length}`)
        res.status(200).json({
            message: "Categories finded successfully",
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