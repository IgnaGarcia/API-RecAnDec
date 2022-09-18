const Command = require('./command.model');
const log = require('../../utils/log.utils')
const { find, create, remove } = require('../../utils/mongoose.utils')

const post = async(req, res) => {
    log.post("command")

    if(req.id && req.body && req.body.expense != undefined) {
        log.content(req.body, req.id)

        let command = await Command.findOne({owner: req.id, expense: req.body.expense})
        if(command != null) {
            log.debug("COMMAND", "updating...")
            command.category = req.body.category !== undefined? req.body.category : command.category
            command.wallet = req.body.wallet !== undefined? req.body.wallet : command.wallet
            command.tags = req.body.tags !== undefined? req.body.tags : command.tags 
        } else {
            command = new Command({ owner: req.id, ...req.body})
        }
        
        await create(res, command, "Command")
    } else return res.status(400).json({ message: "Fields required are null"})
}

const get = async(req, res) => {
    log.get("command")
    let query = { 'owner': req.id }
    await find(res, Command, query, "Commands")
}

const erase = async(req, res) => {
    log.delete("command")
    if(req.id && req.params.command) {
        await remove(res, Command, req.params.command, "Command")
    } else return res.status(400).json({ message: "Fields required are null"})
}

module.exports = { post, get, erase }