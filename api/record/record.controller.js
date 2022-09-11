const Record = require('./record.model');
var mongoose = require('mongoose');
const { verifyAndUpdateLimit } = require('../../utils/limit.utils');
const { getWithPaging } = require('../../utils/paging.utils');
const { dateBetween, fieldInGroup, sumInPeriod } = require('../../utils/query.utils');

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
    const page = req.query.page ? Number(req.query.page) : 1

    let query = { 'owner': req.params.id}
    if(req.body.isOut != undefined) query['isOut'] = req.body.isOut
    query =  dateBetween(query, req.body.dateFrom, req.body.dateUntil)
    query = fieldInGroup(query, req.body.categories, "category")
    query = fieldInGroup(query, req.body.tags, "tags")
    query = fieldInGroup(query, req.body.wallets, "wallet")
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
    // Para balance informativo
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

    // aggregate outputs in period
    // aggregate inputs in period
    // diff between inputs outputs
    // aggregate outputs
    // aggregate inputs
    // aggregate outputs in period - 1
    // aggregate inputs in period - 1
}

const summary = async(req, res) => {
    // Para grafico de tortas
   console.log(`[GET SUMMARY]: ${JSON.stringify(req.params)} - ${JSON.stringify(req.query)}`)
   
   let query = sumInPeriod(req.params.id, req.params.groupBy, req.query.filter, req.query.dateFrom, req.query.dateUntil)
   try {
        const aggregated = await Record.aggregate(query)
        console.log(`[RECORDS AGGREGATED]: ${req.params.groupBy}[${aggregated.length}]`)

        res.status(200).json({
            message: "Records Aggregated Succesfully",
            data: aggregated
        })
   } catch (err) {
        console.error("[ERROR]" + err)
        res.status(500).json({
            message: "Internal Server Error on Aggregating",
            error: err
        });
   }
}

const historical = async(req, res) => {
    // Para grafico de lineas o barras
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
                label: string, 
                data:[ {amount: int, period: string} ]
            }  
        ]
    */

    // aggregate by groupBy and with filter
    // example:
    // groupBy: category, filter: [Alimentos, Impuestos, BlaBlaBla]
    // groupBy: isOut, filter: [true, false]
    // return list de los filtros, que tienen su label y una lista de montos con su periodo
}

module.exports = { post, get, balance, summary, historical }