const Limit = require('./limit.model');
const log = require('../../utils/log.utils')
const { getAcumOfPeriod } = require('../../utils/record.utils');
const { find, create, remove } = require('../../utils/mongoose.utils');

const post = async(req, res) => {
    log.post("limit")

    if(req.body && req.body.category && req.body.amount) {
        log.content(req.body, req.id)
        let today = new Date()
        let limit = new Limit({ owner: req.id, 
            month: today.getMonth()+1,
            year: today.getFullYear(),
            ...req.body })

        limit.acum = await getAcumOfPeriod(limit.owner, limit.category, limit.month-1, limit.year)
        await create(res, limit, "Limit")
    } else return res.status(400).json({ message: "Fields required are null" })
}

const get = async(req, res) => {
    log.get("limits")

    let query = { 'owner': req.id }
    await find(res, Limit, query, "Limits", { year: -1, month: -1 }, 'category')
}

const update = async(req, res) => {
    log.put("limit")
    if(req.id && req.params.limit && req.body.amount) {
        try {
            let limit = await Limit.findById(req.params.limit);
            log.debug("LIMIT", limit)

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
            log.debug("NEW LIMIT", limit)
            await limit.save()
            res.status(200).json({
                message: "Limits updated successfully",
                data: limit
            });
        } catch (e) {
            log.error(e)
            res.status(500).json({
                message: "Internal Server Error on Updating",
                code: e.code,
                error: e
            });
        }
    } else return res.status(400).json({ message: "Fields required are null" })
}

const erase = async(req, res) => {
    log.delete("limit")
    await remove(res, Limit, req.params.limit, "Limit")
}

module.exports = { post, get, update, erase }