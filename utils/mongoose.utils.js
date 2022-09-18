
const find = async(res, Model, query, modelName) => {
    console.log(`[QUERY]: ${JSON.stringify(query)}`)

    try {
        const response = await Model.find(query)

        console.log(`[${modelName.toUpperCase()} FINDED]: ${response.length}`)
        res.status(200).json({
            message: `${modelName} finded successfully`,
            data: response
        });
    } catch (err) {
        console.error("[ERROR]: " + err)
        res.status(500).json({
            message: "Internal Server Error on Finding",
            error: err
        });
    }
}

module.exports = { find }