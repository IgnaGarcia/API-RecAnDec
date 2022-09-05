const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const WalletSchema = Schema({
    owner: {type: Schema.Types.ObjectId, ref: 'users'},
    label: String,
    acum: Number,
    alias: String
});

WalletSchema.index( { owner: 1, label: 1}, { unique: true } )
WalletSchema.index( { owner: 1, alias: 1}, { unique: true } )

module.exports = mongoose.model("wallets", WalletSchema);