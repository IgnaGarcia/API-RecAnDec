const Tag = require('./tag.model');
const log = require('../../utils/log.utils')
const { create, findWithPaging } = require('../../utils/mongoose.utils');

const post = async(req, res) => {
    log.post("tag")

    if(req.body && req.body.label && req.body.alias) {
        log.content(req.body, req.params.id)
        let tag = new Tag({ owner: req.params.id, ...req.body })

        await create(res, tag, "Tag")
    } else return res.status(400).json({ message: "Fields required are null" })
}

const get = async(req, res) => {
    log.get("tags")
    const page = req.query.page ? Number(req.query.page) : 1

    let query = { 'owner': req.params.id }
    await findWithPaging(res, Tag, query, "Tags", { createDate: -1}, page)
}

module.exports = { post, get }