const Tag = require('./tag.model');
const log = require('../../utils/log.utils')
const { create, find } = require('../../utils/mongoose.utils');

const post = async(req, res) => {
    log.post("tag")

    if(req.body && req.body.label && req.body.alias) {
        log.content(req.body, req.id)
        let tag = new Tag({ owner: req.id, ...req.body })

        let exists = await Tag.find({ $or: [{ 'owner': req.id }, { 'owner': null }] })
        if(exists) {
            return res.status(500).json({
                message: "Duplicate Key Error",
                code: 11000,
                error: "Duplicate Key Error"
            });
        }
        await create(res, tag, "Tag")
    } else return res.status(400).json({ message: "Fields required are null" })
}

const get = async(req, res) => {
    log.get("tags")

    let query = { $or: [{ 'owner': req.id }, { 'owner': null }] }
    await find(res, Tag, query, "Tags", { createDate: -1, label: 1 })
}

module.exports = { post, get }