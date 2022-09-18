const Record = require('./record.model');
const log = require('../../utils/log.utils')
const { verifyAndUpdateLimit } = require('../../utils/limit.utils');
const { findWithPaging } = require('../../utils/mongoose.utils');
const { dateBetween, fieldInGroup, sumInPeriod, balanceInPeriod, calcHistorical } = require('../../utils/query.utils');
// TODO put de record

const post = async(req, res) => {
    log.post("record")
    // TODO acum in Wallet
    if(req.body && req.body.amount && req.body.category) {
        log.content(req.body, req.params.id)
        let record = new Record({ owner: req.params.id, ...req.body })
        log.debug("RECORD", record)

        const msg = record.isOut? await verifyAndUpdateLimit(record) : null

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
    log.content(req.body, req.params.id)
    const page = req.query.page ? Number(req.query.page) : 1

    let query = { 'owner': req.params.id}
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
    log.content(req.query, req.params)

    let actualQuery = balanceInPeriod(req.params.id, req.query.dateFrom, req.query.dateUntil)
    let historicalQuery = balanceInPeriod(req.params.id)
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

const summary = async(req, res) => {
    // Para grafico de tortas
    log.get("summary")
    log.content(req.query, req.params)
   
   let query = sumInPeriod(req.params.id, req.params.groupBy, req.query.filter, req.query.dateFrom, req.query.dateUntil)
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
    log.content(req.query, req.params)

    let elToObj = (el) => {
        return {
            month: el._id.month,
            year: el._id.year,
            acum: el.acum,
            count: el.count
        }
    }

    let query = calcHistorical(req.params.id, req.params.groupBy, req.query.dateFrom, req.query.dateUntil)
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

module.exports = { post, get, balance, summary, historical }