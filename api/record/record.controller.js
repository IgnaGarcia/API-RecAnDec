const Record = require('./record.model');
const log = require('../../utils/log.utils')
const { verifyAndUpdateLimit, updateWallet } = require('../../utils/record.utils');
const { findWithPaging } = require('../../utils/mongoose.utils');
const { dateBetween, fieldInGroup, sumInPeriod, balanceInPeriod, calcHistorical } = require('../../utils/query.utils');

const post = async(req, res) => {
    log.post("record")
    if(req.body && req.body.amount && req.body.category) {
        log.content(req.body, req.id)
        let record = new Record({ owner: req.id, ...req.body })
        log.debug("RECORD", record)

        const msg = record.isOut? await verifyAndUpdateLimit(record) : null
        if(record.wallet) await updateWallet(record)

        try {
            await record.save()
            log.debug("RECORD CREATED", record)
            res.status(201).json({
                message: "Record created successfully",
                data: {record, msg}
            });
        } catch(err) {
            log.error(err)
            res.status(500).json({
                message: "Internal Server Error on Saving",
                code: err.code,
                error: err
            });
        }
    } else return res.status(400).json({ message: "Fields required are null" })
}

const get = async(req, res) => {
    log.get("records")
    log.content(req.body, req.id)
    const page = req.query.page ? Number(req.query.page) : 1

    let query = { 'owner': req.id}
    if(req.body.isOut != undefined) query['isOut'] = req.body.isOut
    query =  dateBetween(query, req.body.dateFrom, req.body.dateUntil)
    query = fieldInGroup(query, req.body.categories, "category")
    query = fieldInGroup(query, req.body.tags, "tags")
    query = fieldInGroup(query, req.body.wallets, "wallet")
    log.debug("QUERY", query)

    await findWithPaging(res, Record, query, "Records", { date: -1 }, page)
}

const balance = async(req, res) => {
    // Para balance informativo
    log.get("balance")
    log.content(req.query, req.id)

    let actualQuery = balanceInPeriod(req.id, req.query.dateFrom, req.query.dateUntil)
    let historicalQuery = balanceInPeriod(req.id)
    try {
        const thisMonths = await Record.aggregate(actualQuery)
        const historical = await Record.aggregate(historicalQuery)
        log.debug("RECORDS AGGREGATED", "last 2 months and historical")

        thisMonths[2] = historical[0]
        res.status(200).json({
            message: "Records Aggregated Succesfully",
            data: thisMonths
        })
    } catch (err) {
        log.error(err)
        res.status(500).json({
            message: "Internal Server Error on Aggregating",
            code: err.code,
            error: err
        });
    }
}

const update = async(req, res) => {
    log.put("record")
    if(req.id && req.params.record && req.body) {
        try {
            let record = await Record.findByIdAndUpdate(req.params.record, 
                { wallet: req.body.wallet, tags: req.body.tags },
                { new: true })
            
            log.debug("RECORD UPDATED", record)
            res.status(200).json({
                message: "Record updated successfully",
                data: record
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

const summary = async(req, res) => {
    // Para grafico de tortas
    log.get("summary")
    log.content(req.query, req.id)
   
   let query = sumInPeriod(req.id, req.params.groupBy, req.query.filter, req.query.dateFrom, req.query.dateUntil)
   if(!query) return res.status(400).json({ message: "Fields required are null" })
   try {
        const aggregated = await Record.aggregate(query)
        log.debug("RECORDS AGGREGATED", aggregated.length)

        res.status(200).json({
            message: "Records Aggregated Succesfully",
            data: aggregated
        })
   } catch (err) {
        log.error(err)
        res.status(500).json({
            message: "Internal Server Error on Aggregating",
            code: err.code,
            error: err
        });
   }
}

const historical = async(req, res) => {
    // Para grafico de lineas o barras
    log.get("historical")
    log.content(req.query, req.id)

    let elToObj = (el) => {
        return {
            month: el._id.month,
            year: el._id.year,
            acum: el.acum,
            count: el.count
        }
    }

    let query = calcHistorical(req.id, req.params.groupBy, req.query.filter)
    if(!query) return res.status(400).json({ message: "Fields required are null" })
    try {
        const aggregated = await Record.aggregate(query)
        const response = {}
        aggregated.forEach( el => {
            if(response[el._id.label]) response[el._id.label].push(elToObj(el)) 
            else response[el._id.label] = [elToObj(el)]
        })
        log.debug("RECORDS AGGREGATED", Object.keys(response))

        res.status(200).json({
            message: "Records Aggregated Succesfully",
            data: response
        })
    } catch (err) {
        log.error(err)
        res.status(500).json({
            message: "Internal Server Error on Aggregating",
            code: err.code,
            error: err
        });
    }
}

module.exports = { post, get, balance, summary, historical, update }