const Category = require('./category.model');
const log = require('../../utils/log.utils')
const { find, create } = require('../../utils/mongoose.utils');

const post = async(req, res) => {
    log.post("category")

    if(req.body && req.body.label && req.body.alias) {
        log.content(req.body, req.id)
        let category = new Category({ owner: req.id, ...req.body })
        
        await create(res, category, "Category")
    } else return res.status(400).json({ message: "Fields required are null" })
}

const get = async(req, res) => {
    log.get("category")

    let query = { $or: [{ 'owner': req.id }, { 'owner': null }] }
    
    await find(res, Category, query, "Categories", { createDate: -1 })
}

module.exports = { post, get }