const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RecordSchema = Schema({
    owner: {type: Schema.Types.ObjectId, ref: 'users'},
    category: {type: Schema.Types.ObjectId, ref: 'categories'},
    tags: [ {type: Schema.Types.ObjectId, ref: 'tags'} ],
    wallet: {type: Schema.Types.ObjectId, ref: 'wallets'},
    amount: Number,
    date: String
});

module.exports = mongoose.model("records", RecordSchema);