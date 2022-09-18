const { getWithPaging } = require("./paging.utils");

const create = async(res, instance, modelName) => {
    console.log(`[${modelName.toUpperCase()}]: ${instance}`)
    try {
        await instance.save()
        console.log(`[${modelName.toUpperCase()} CREATED]: ${instance}`)

        return res.status(201).json({
            message: `${modelName} created successfully`,
            data: instance
        });
    } catch(err) {
        let message = (err.code == 11000) ? "Duplicate Key Error" : "Internal Server Error on Saving"
        console.log("[ERROR]: " + err)

        return res.status(500).json({
            message,
            code: err.code,
            error: err
        });
    }
}

const find = async(res, Model, query, modelName) => {
    console.log(`[QUERY]: ${JSON.stringify(query)}`)

    try {
        const response = await Model.find(query)

        console.log(`[${modelName.toUpperCase()} FINDED]: ${response.length}`)
        return res.status(200).json({
            message: `${modelName} finded successfully`,
            data: response
        });

    } catch (err) {
        console.error("[ERROR]: " + err)

        return res.status(500).json({
            message: "Internal Server Error on Finding",
            code: err.code,
            error: err
        });
    }
}

const findWithPaging = async(res, Model, query, modelName, order, page=1, size=20) => {
    console.log(`[QUERY]: ${JSON.stringify(query)}`)
    
    try {
        const paginatedResponse = await getWithPaging(Model, query, order, page, size)

        console.log(`[${modelName.toUpperCase()} FINDED]: ${paginatedResponse.data.length}`)
        return res.status(200).json({
            message: `${modelName} finded successfully`,
            ...paginatedResponse
        });
        
    } catch (err) {
        console.error("[ERROR]: " + err)

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
        console.error("[ERROR]: " + err)

        res.status(500).json({
            message: "Internal Server Error on Deleting",
            code: err.code,
            error: err
        });
    }
}

module.exports = { find, findWithPaging, create, remove }