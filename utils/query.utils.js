const dateBetween = (query, from, until) => {
    if(from && until) query['date'] = {
        $gte: new Date(from), 
        $lt: new Date(until)
    }
    return query
}

const fieldInGroup = (query, list, property) => {
    if(list && list.length > 0) query[property] = { $in: list}
    return query
}

module.exports = { dateBetween, fieldInGroup }