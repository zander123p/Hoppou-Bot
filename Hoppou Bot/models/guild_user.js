const mongoose = require('mongoose');

const user_profileSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    userID: String,
    permissionGroups: [String],
    messages: Number,
});

module.exports = mongoose.model('Guild User', user_profileSchema, 'guild_users');