const Command = require('./command.model');
const { find, create, remove } = require('../../utils/mongoose.utils')

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
        
        await create(res, command, "Command")
    } else return res.status(400).json({ message: "Fields required are null"})
}

const get = async(req, res) => {
    console.log("[GET]: command")
    let query = { $or: [{'owner': req.params.id}, {'telegramId': req.params.id}] }
    await find(res, Command, query, "Commands")
}

const erase = async(req, res) => {
    console.log("[DELETE]: command")
    if(req.params.id && req.params.command) {
        await remove(res, Command, req.params.command, "Command")
    } else return res.status(400).json({ message: "Fields required are null"})
}

module.exports = { post, get, erase }