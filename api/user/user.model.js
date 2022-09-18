const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = Schema({
    email: String,
    password: String,
    name: String,
    telegramId: String,
    inCommand: {type: Schema.Types.ObjectId, ref: 'commands'},
    outCommand: {type: Schema.Types.ObjectId, ref: 'commands'}
});

UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
};

UserSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.index( { email: 1}, { unique: true } )
UserSchema.index( { telegramId: 1}, { unique: true } )

module.exports = mongoose.model("users", UserSchema);