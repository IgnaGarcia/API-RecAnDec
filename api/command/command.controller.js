const Command = require('./command.model');

// TODO: servicios de comandos
// TODO: servicios de auth
// TODO: put de record
// TODO: telegram services
const post = async(req, res) => {
    console.log("[POST]: command ")
    if(req.params.id && req.body) {
    /*
    Path: userId
    Request:
        expense: bool
    category: string
    tags: [string]
    wallet: string
    Response:
        message: string
        code: int
        data: string

    */
    } else return res.status(400).json({ message: "Fields  required are null"})
}

const get = async(req, res) => {
    console.log("[GET]: command")
    /*
    Path: userId
    Request:
    Response:
        message: string
        code: int
        data: 
            expenseCommand: Command
            incomeCommand: Command
    */
}

const update = async(req, res) => {
    console.log("[PUT]: command")
    /*
    Path: userId
    Request:
        expense: bool
    category: string
    tags: [string]
    wallet: string
    Response:
        message: string
        code: int
    	data: string
    */
}

const erase = async(req, res) => {
    console.log("[DELETE]: command")
    /*
    Path: userId
    Request:
        expense: bool
    Response:
        message: string
        code: int
        data: string
    */
}

module.exports = { post, get, update, erase }