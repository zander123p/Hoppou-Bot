const mongoose = require('mongoose');

const user_profileSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    userID: String,
    permissionGroups: [String],
    messages: Number,
    VCTracker: [{ id: String, mins: Number }],
    exp: Number,
});

module.exports = mongoose.model('Guild User', user_profileSchema, 'guild_users');