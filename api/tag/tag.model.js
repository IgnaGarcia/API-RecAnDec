const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TagSchema = Schema({
    owner: {type: Schema.Types.ObjectId, ref: 'users'},
    label: String,
    alias: String,
    createDate: Date
});

TagSchema.index( { owner: 1, label: 1}, { unique: true } )
TagSchema.index( { owner: 1, alias: 1}, { unique: true } )

module.exports = mongoose.model("tags", TagSchema);