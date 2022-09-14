const Tag = require('./tag.model');
const { getWithPaging } = require('../../utils/paging.utils');

const post = async(req, res) => {
    console.log("[POST]: tag ")

    if(req.body && req.body.label && req.body.alias) {
        console.log("[BODY]: " + JSON.stringify(req.body) + "; [ID]: " + req.params.id)
        let tag = new Tag({ owner: req.params.id, ...req.body })
        tag.createDate = new Date().toISOString()
        console.log("[TAG]: " + tag)
  
        try {
            await tag.save()
            console.log("[TAG CREATED]: " + tag)
            res.status(201).json({
                message: "Tag created successfully",
                data: tag
            });
        } catch(err) {
            let message = (err.code == 11000) ? "Duplicate Key Error" : "Internal Server Error on Saving"
            console.log("[ERROR]: " + err)
            res.status(500).json({
                message,
                code: err.code,
                error: err
            });
        }
    } else return res.status(400).json({ message: "Fields required are null" })
}

const get = async(req, res) => {
    console.log("[GET]: tags")
    
}

module.exports = { post, get }