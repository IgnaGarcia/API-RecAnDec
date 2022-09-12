const Limit = require('../api/limit/limit.model');
const Record = require('../api/record/record.model');
const ObjectId = require("mongoose").Types.ObjectId;


const verifyAndUpdateLimit = (rec) => {
    console.log("[VERIFY LIMIT]")
    return new Promise(async(resolve, reject) => {
        let response = {}
        try {
            const limit = await Limit.findOne({ owner: rec.owner, category: rec.category }).exec()

            const date = new Date(rec.date)
            if(limit.month != date.getMonth()+1 && limit.year != date.getFullYear()) {
                console.log("RESET LIMIT")
                limit.month = date.getMonth()+1
                limit.year = date.getFullYear()
                limit.acum = 0
            }
            console.log("[LIMIT]: " + limit)  
            

            const records = await Record.find({ $expr: {
                $and: [
                    { "owner": rec.owner},
                    { "category": rec.category},
                    { "isOut": true},
                    { "$eq": [ { "$month": "$date" }, limit.month ]},
                    { "$eq": [ { "$year": "$date" }, limit.year ] }
                ]
            }}).exec()
            console.log("[RECORDS]: " + records.length)

            let acum = records.reduce((prev, curr) => prev + curr.amount, 0)
            acum += rec.amount
            console.log("[ACUM]: " + acum)

            if(acum > limit.amount) 
                response = "Has superado tu limite mensual en la categoria por $" + (acum - limit.amount)
            else if(acum > limit.amount*0.8) 
                response = "Estas por superar tu limite mensual en la categoria, te quedan $" + (limit.amount - acum)
            else 
                response = null

            limit.acum = acum
            await limit.save()

            console.log(`[LIMIT STATUS] ${acum}: ${response}`)
            resolve(response)
        } catch(e) {
            console.log("[ERROR]" + e)
            reject(e)
        }
    });
}

const getAcumOfPeriod = (owner, category, month, year) => {
    console.log("[GETTING ACUM]")
    return new Promise(async(resolve, reject) => {
        try{
            const records = await Record.aggregate([
                {
                    $match: {
                        'owner': ObjectId(owner),
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
            console.log(`[LIMIT STATUS] ${records}`)
            resolve(records)
        } catch(e) {
            console.log("[ERROR]" + e)
            reject(e)
        }
    })
}


module.exports = { verifyAndUpdateLimit, getAcumOfPeriod }