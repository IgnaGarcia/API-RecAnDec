const Record = require('./record.model');
var mongoose = require('mongoose');
const { verifyAndUpdateLimit } = require('../../utils/limit.utils');
const { getWithPaging } = require('../../utils/paging.utils');

const post = async(req, res) => {
    console.log("[POST]: record ")
    // TODO acum in Wallet
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
    const page = req.query.page ? Number(req.query.page) : 1

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
        const paginatedResponse = await getWithPaging(Record, query, { date: -1 }, page)

        console.log(`[RECORDS FINDED]: ${paginatedResponse.data.length}`)
        res.status(200).json({
            message: "Record finded successfully",
            ...paginatedResponse
        });
    } catch (err) {
        console.error("[ERROR]" + err)
        res.status(500).json({
            message: "Internal Server Error on Finding",
            error: err
        });
    }
}

const balance = async(req, res) => {
    /*
    Path: userId
    Request:
        dateFrom: string
        dateUntil: string
    Response:
        message: string
        code: int
        data: 
            balance: int
            income: int
            expense: int
            avgIncome: int
            avgExpense: int
            lastIncome: int
            lastExpense: int
    */
}

const summary = async(req, res) => {
    /*
    Path: userId
    Request:
        groupBy: string
        filter: [string]
        dateFrom: string
        dateUntil: string
    Response:
        message: string
        code: int
        data: [ {category: string, amount: int} ]
    */
}

const historical = async(req, res) => {
    /*
    Path: userId
    Request:
        groupBy: string
        filter: [string]
    Response:
        message: string
        code: int
        data: [ 
    {
    element: string, 
    data:[ {amount: int, period: string} ]
    } 
    ]
    */
}

module.exports = { post, get, balance, summary, historical }