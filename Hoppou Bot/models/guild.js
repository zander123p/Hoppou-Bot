const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    guildName: String,
    settings: {},
    modules: [{ module: String, settings: [{ name: String, value: mongoose.Schema.Types.Mixed }] }],
    oldLogs: [{ id: String, log: String }],
    permissionGroups: [{ name: String, permissions: [String], blacklist: [String], role: String }],
    reactionMessages: [{ messageID: String, roles: [{ roleID: String, emojiID: String }] }],
}, {
    typeKey: '$type',
});

module.exports = mongoose.model('Guild', guildSchema, 'guilds');