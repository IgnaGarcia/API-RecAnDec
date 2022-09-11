const ObjectId = require("mongoose").Types.ObjectId;

const dateBetween = (query, from, until) => {
    if(from && until) query['date'] = {
        $gte: new Date(from), 
        $lt: new Date(until)
    }
    return query
}

const fieldInGroup = (query, list, property) => {
    if(list && list.length > 0) query[property] = { $in: list.map((id) => ObjectId(id) )}
    return query
}

const toArray = (elements) => {
    return Array.isArray(elements)? elements : [elements]
}

const sumInPeriod = (owner, groupBy, filter, from, until) => {
    if(owner && groupBy && from && until) {
        let fromCollection = 
            groupBy == 'category'? 'categories' :
            groupBy == 'wallet'? 'wallets': groupBy 
        let inList = (filter && filter.length > 0)? 
            fieldInGroup({}, toArray(filter), groupBy) 
            : ""

        return [
            {
                $match: {
                    'owner': ObjectId(owner),
                    ...dateBetween({}, from, until), 
                    ...inList,
                    'isOut': true
                }
            },
            {
                $lookup: {
                    from: fromCollection,
                    localField: groupBy,
                    foreignField: "_id",
                    as: groupBy
                }
            },
            {
                $unwind: `$${groupBy}`
            },
            {
                $group: {
                    _id: { key: `$${groupBy}._id`, label: `$${groupBy}.label` },
                    acum: { $sum: "$amount"},
                    count: { $sum: 1 }
                }
            },
        ]
    }
    return null
}

module.exports = { dateBetween, fieldInGroup, sumInPeriod }