const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorySchema = Schema({
    owner: {type: Schema.Types.ObjectId, ref: 'users'},
    label: String,
    alias: String,
    isOut: Boolean
});

CategorySchema.index( { owner: 1, label: 1}, { unique: true } )
CategorySchema.index( { owner: 1, alias: 1}, { unique: true } )

module.exports = mongoose.model("categories", CategorySchema);