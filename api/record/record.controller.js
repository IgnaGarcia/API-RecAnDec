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

module.exports = { post }