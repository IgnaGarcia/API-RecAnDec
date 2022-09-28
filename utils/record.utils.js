const Limit = require('../api/limit/limit.model');
const Wallet = require('../api/wallet/wallet.model');
const Record = require('../api/record/record.model');
const ObjectId = require("mongoose").Types.ObjectId;
const log = require('./log.utils')

const verifyAndUpdateLimit = (rec) => {
    log.debug("VERIFY LIMIT", rec.category)
    
    return new Promise(async(resolve, reject) => {
        let response = {}
        try {
            const limit = await Limit.findOne({ owner: rec.owner, category: rec.category }).exec()
            // Si no existe el limite termina
            if(!limit) resolve(null)

            const date = new Date(rec.date)
            if(limit.month != date.getMonth()+1 && limit.year != date.getFullYear()) {
                log.debug("RESET LIMIT", limit)
                limit.month = date.getMonth()+1
                limit.year = date.getFullYear()
                limit.acum = 0
            }
            log.debug("LIMIT", limit)

            const records = await Record.find({ $expr: {
                $and: [
                    { "owner": rec.owner},
                    { "category": rec.category},
                    { "isOut": true},
                    { "$eq": [ { "$month": "$date" }, limit.month ]},
                    { "$eq": [ { "$year": "$date" }, limit.year ] }
                ]
            }}).exec()
            log.debug("RECORDS", records.length)

            let acum = records.reduce((prev, curr) => prev + curr.amount, 0)
            acum += rec.amount
            log.debug("ACUM", acum)

            if(acum > limit.amount) 
                response = "Has superado tu limite mensual en la categoria por $" + (acum - limit.amount)
            else if(acum > limit.amount*0.8) 
                response = "Estas por superar tu limite mensual en la categoria, te quedan $" + (limit.amount - acum)
            else 
                response = null

            limit.acum = acum
            await limit.save()

            log.debug(`LIMIT STATUS`, `${acum} - ${response}`)
            resolve(response)
        } catch(e) {
            log.error(e)
            reject(e)
        }
    });
}

const getAcumOfPeriod = (owner, category, month, year) => {
    log.debug("GETTING ACUM", category)
    return new Promise(async(resolve, reject) => {
        try{
            const records = await Record.aggregate([
                {
                    $match: {
                        $or: [{ 'owner': owner }, { 'owner': null }],
                        'isOut': true,
                        'category': ObjectId(category)
                    }
                },
                {
                    $group: {
                        _id: { year: { $year: "$date" }, month: { $month: "$date" } },
                        acum: { $sum: "$amount" }
                    }
                },
                {
                    $sort: { _id: -1 }
                }
            ]).exec()
            log.debug("LIMIT STATUS", JSON.stringify(records[0]))
            if(records || records.length == 0) resolve(0)
            else if(records[0]._id.month != month && records[0]._id.year != year) resolve(0)
            else resolve(records[0].acum)
        } catch(e) {
            log.error(e)
            reject(e)
        }
    })
}


const updateWallet = (rec) => {
    log.debug("UPDATE WALLET", rec.wallet)

    return new Promise(async(resolve, reject) => {
        try {
            let wallet = await Wallet.findById(rec.wallet)
            wallet.acum = rec.isOut? wallet.acum - rec.amount : wallet.acum + rec.amount
            log.debug("WALLET UPDATED", wallet)
            await wallet.save()
            resolve(wallet)
        } catch (e) {
            log.error(e)
            reject(e)
        }
    })
}

module.exports = { verifyAndUpdateLimit, getAcumOfPeriod, updateWallet }