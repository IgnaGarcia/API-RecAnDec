const Command = require('./command.model');

const post = async(req, res) => {
    console.log("[POST]: command ")

    if(req.params.id && req.body && req.body.expense != undefined) {
        console.log("[BODY]: " + JSON.stringify(req.body) + "; ID: " + req.params.id)

        let command = await Command.findOne({owner: req.params.id, expense: req.body.expense})
        if(command != null) {
            console.log("Command exists, updating...")
            command.category = req.body.category !== undefined? req.body.category : command.category
            command.wallet = req.body.wallet !== undefined? req.body.wallet : command.wallet
            command.tags = req.body.tags !== undefined? req.body.tags : command.tags 
        } else {
            command = new Command({ owner: req.params.id, ...req.body})
        }
        console.log("[COMMAND]: " + command)

        try {
            await command.save()
            console.log("[COMMAND CREATED/UPDATED]: " + command)
            res.status(201).json({
                message: "Command created/updated successfully",
                data: command
            });
        } catch(err) {
            console.log("[ERROR]: " + err)
            res.status(500).json({
                message: "Internal Server Error on Saving",
                code: err.code,
                error: err
            });
        }
    } else return res.status(400).json({ message: "Fields  required are null"})
}

const get = async(req, res) => {
    console.log("[GET]: command")
    let query = { $or: [{'owner': req.params.id}, {'telegramId': req.params.id}] }
    console.log(`[QUERY]: ${JSON.stringify(query)}`)

    try {
        let response = await Command.find(query)
        console.log(`[COMMANDS FINDED]: ${response.length}`)
        res.status(200).json({
            message: "Commands finded successfully",
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

const erase = async(req, res) => {
    console.log("[DELETE]: command")
    if(req.params.id && req.params.command) {
        try {
            await Command.findByIdAndDelete(req.params.command);
            res.status(200).json({
                message: "Command deleted successfully",
                data: req.params.command
            });
        } catch (e) {
            console.error("[ERROR]: " + err)
            res.status(500).json({
                message: "Internal Server Error on Deleting",
                error: err
            });
        }
    } else return res.status(400).json({ message: "Fields required are null"})
}

module.exports = { post, get, erase }