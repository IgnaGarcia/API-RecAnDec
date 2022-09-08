const Record = require('./record.model');
var mongoose = require('mongoose');
const { verifyAndUpdateLimit } = require('../../utils/limit.utils');

const post = async(req, res) => {
    console.log("[POST]: record ")

    if(req.body && req.body.amount && req.body.category) {
        console.log("[BODY]: " + JSON.stringify(req.body) + "; [ID]: " + req.params.id)
        let record = new Record({ owner: req.params.id, ...req.body })
        record.date = new Date().toISOString()
        console.log("[RECORD]: " + record)

        const msg = await verifyAndUpdateLimit(record) 

        try {
            await record.save()
            console.log("[RECORD CREATED]: " + record)
            res.status(201).json({
                message: "Record created successfully",
                data: {record, msg}
            });
        } catch(err) {
            console.error("[ERROR]" + err)
            res.status(500).json({
                message: "Internal Server Error on Saving",
                error: err
            });
        }
    } else return res.status(400).json({ message: "Fields required are null" })
}

const get = async(req, res) => {
    console.log("[GET]: records, Body: " + JSON.stringify(req.body))
   
    let query = { 'owner': req.params.id}
    if(req.body.isOut != undefined) query['isOut'] = req.body.isOut
    if(req.body.dateFrom && req.body.dateUntil) query['date'] =  {
        $gte: new Date(req.body.dateFrom), 
        $lt: new Date(req.body.dateUntil)
    }
    if(req.body.categories && req.body.categories.length > 0) query['category'] = { $in: req.body.categories }
    if(req.body.tags && req.body.tags.length > 0) query['tags'] = { $in: req.body.tags }
    if(req.body.wallets && req.body.wallets.length > 0) query['wallets'] = { $in: req.body.wallets }
    console.log(`[QUERY]: ${JSON.stringify(query)}`)

    try {
        const records = await Record.find(query).exec()
        console.log(`[RECORDS FINDED]: ${records.length}`)
        res.status(200).json({
            message: "Record finded successfully",
            data: records
        });
    } catch (err) {
        console.error("[ERROR]" + err)
        res.status(500).json({
            message: "Internal Server Error on Finding",
            error: err
        });
    }
}

module.exports = { post, get }