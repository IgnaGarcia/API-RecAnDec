const log = require('./log.utils')

const create = async(res, instance, modelName) => {
    log.debug(modelName.toUpperCase(), instance)
    try {
        await instance.save()
        log.debug("CREATED", instance)

        return res.status(201).json({
            message: `${modelName} created successfully`,
            data: instance
        });
    } catch(err) {
        let message = (err.code == 11000) ? "Duplicate Key Error" : "Internal Server Error on Saving"
        log.error(err)

        return res.status(500).json({
            message,
            code: err.code,
            error: err
        });
    }
}

const find = async(res, Model, query, modelName, order={}) => {
    log.query(query)

    try {
        const response = await Model.find(query).sort(order)

        log.debug("FINDED", response.length)
        return res.status(200).json({
            message: `${modelName} finded successfully`,
            data: response
        });

    } catch (err) {
        log.error(err)

        return res.status(500).json({
            message: "Internal Server Error on Finding",
            code: err.code,
            error: err
        });
    }
}

const findWithPaging = async(res, Model, query, modelName, order, page=1, size=20) => {
    log.query(query)
    
    try {
        const response = await getWithPaging(Model, query, order, page, size)

        log.debug("FINDED", response.data.length)
        return res.status(200).json({
            message: `${modelName} finded successfully`,
            ...response
        });
        
    } catch (err) {
        log.error(err)

        return res.status(500).json({
            message: "Internal Server Error on Finding",
            code: err.code,
            error: err
        });
    }
}

const remove = async(res, Model, id, modelName) => {
    try {
        await Model.findByIdAndDelete(id);
        res.status(200).json({
            message: `${modelName} deleted successfully`,
            data: id
        });

    } catch (e) {
        log.error(err)

        res.status(500).json({
            message: "Internal Server Error on Deleting",
            code: err.code,
            error: err
        });
    }
}

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
            next: page >= maxPage ? null : page + 1,
            previus: page == 1? null : page - 1,
            last: maxPage
        }
    }
}

module.exports = { find, findWithPaging, create, remove }