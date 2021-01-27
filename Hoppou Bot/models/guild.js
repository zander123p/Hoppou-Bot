const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    guildName: String,
    settings: {
        prefix: String,
        channels: [{ name: String, logs: [String]}],
        muteRole: String,
        welcomeChannel: String,
        welcomeMessage: String,
        newcommerChannel: String,
        newcommerRole: String,
        rejectChannel: String,
        rejectRole: String,
    },
    oldLogs: [{id: String, log: String}],
    permissionGroups: [{name: String, permissions: [String], blacklist: [String], role: String}],
}, {
    typeKey: '$type'
});

module.exports = mongoose.model('Guild', guildSchema, 'guilds');