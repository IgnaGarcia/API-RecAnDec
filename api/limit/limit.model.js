const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LimitSchema = Schema({
    owner: {type: Schema.Types.ObjectId, ref: 'users'},
    category: {type: Schema.Types.ObjectId, ref: 'categories'},
    month: Number,
    year: Number,
    acum: Number,
    amount: Number
});

LimitSchema.index( { owner: 1, category: 1}, { unique: true } )

module.exports = mongoose.model("limits", LimitSchema);