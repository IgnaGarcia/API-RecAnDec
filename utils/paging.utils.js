const getWithPaging = async(Model, query, order={ date: -1 }, page=1, size=20) => {
    const response = await Model.find(query)
        .sort(order)
        .limit(size)
        .skip((page-1)*size)
        .exec()

    const maxPage = Math.ceil(await Model.count(query) / size)

    return {
        data: response,
        paging: {
            next: page == maxPage ? null : page + 1,
            previus: page == 1? null : page - 1,
            last: maxPage
        }
    }
}

module.exports = { getWithPaging }