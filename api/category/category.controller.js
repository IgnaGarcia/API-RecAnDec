const Category = require('./category.model');
const { findWithPaging, create } = require('../../utils/mongoose.utils');

const post = async(req, res) => {
    console.log("[POST]: category ")

    if(req.body && req.body.label && req.body.alias) {
        console.log("[BODY]: " + JSON.stringify(req.body) + "; [ID]: " + req.params.id)
        let category = new Category({ owner: req.params.id, ...req.body })
        
        await create(res, category, "Category")
    } else return res.status(400).json({ message: "Fields required are null" })
}

const get = async(req, res) => {
    console.log("[GET]: categories")
    const page = req.query.page ? Number(req.query.page) : 1

    let query = { $or: [{ 'owner': req.params.id }, { 'owner': null }] }
    
    await findWithPaging(res, Category, query, "Categories", { createDate: -1 }, page)
}

module.exports = { post, get }