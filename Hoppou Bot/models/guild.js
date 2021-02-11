const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    guildName: String,
    settings: {
        prefix: String,
        channels: [{ name: String, logs: [String]}],
        VCTrackerChannels: [{id: String, threshold: Number}],
        muteRole: String,
        welcomeChannel: String,
        welcomeMessage: String,
        newcommerChannel: String,
        newcommerRole: String,
        rejectChannel: String,
        rejectRole: String,
        rankupChannel: String,
    },
    oldLogs: [{id: String, log: String}],
    permissionGroups: [{name: String, permissions: [String], blacklist: [String], role: String}],
    reactionMessages: [{messageID: String, roles: [{roleID: String, emojiID: String}]}],
}, {
    typeKey: '$type'
});

module.exports = mongoose.model('Guild', guildSchema, 'guilds');