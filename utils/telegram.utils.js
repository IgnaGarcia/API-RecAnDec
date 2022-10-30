const User = require("../api/user/user.model");
const log = require('./log.utils')
const { find } = require("./mongoose.utils");

const getUserFromTgId = async(telegramId) => {
    const user = await User.find({ "telegramId": telegramId })
    return user
}

const getListOf = async(res, Model, telegramId, modelName, populate) => {
    log.get(`${modelName} from Telegram`)
    
    let owner = await getUserFromTgId(telegramId)
    if(!owner){
        log.error({code: 404, message: "User not found"})
        return res.status(404).json({
            message: "Owner not found"
        });
    }
    let query = { $or: [{ 'owner': owner }, { 'owner': null }] }
    
    find(res, Model, query, modelName, {}, populate)
}

const generateToken = () => {
    return "_" + Math.random().toString(36).substring(2, 9)
}

module.exports = { getUserFromTgId, getListOf, generateToken }
