const mongoose = require('mongoose');

const user_profileSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: String,
    guildID: String,
    // guilds: [{ guildID: String, data: [mongoose.Schema.Types.Mixed] }],
    permissionGroups: [String],
    messages: Number,
    VCTracker: [{ id: String, mins: Number }],
    exp: Number,
});

module.exports = mongoose.model('Guild User', user_profileSchema, 'guild_users');