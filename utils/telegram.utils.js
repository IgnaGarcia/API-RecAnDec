const User = require("../api/user/user.model");
const { find } = require("./mongoose.utils");

const getUserFromTgId = async(telegramId) => {
    const user = await User.find({ "telegramId": telegramId })
    return user
}

const getListOf = async(res, Model, telegramId, modelName) => {
    console.log(`[GET]: ${modelName} from telegram`)
    
    let owner = await getUserFromTgId(telegramId)
    if(!owner){
        console.log("User not found")
        return res.status(404).json({
            message: "Owner not found"
        });
    }
    let query = { $or: [{ 'owner': owner }, { 'owner': null }] }
    
    find(res, Model, query, modelName)
}

module.exports = { getUserFromTgId, getListOf }