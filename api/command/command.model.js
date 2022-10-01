const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommandSchema = Schema({
    owner: {type: Schema.Types.ObjectId, ref: 'users'},
    category: {type: Schema.Types.ObjectId, ref: 'categories'},
    tags: [ {type: Schema.Types.ObjectId, ref: 'tags'} ],
    wallet: {type: Schema.Types.ObjectId, ref: 'wallets'},
    expense: Boolean
});

module.exports = mongoose.model("commands", CommandSchema);