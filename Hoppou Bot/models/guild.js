const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    guildName: String,
    settings: {
        prefix: String,
        channels: [{ name: String, logs: [Number] }],
    },
}, {
    typeKey: '$type'
});

module.exports = mongoose.model('Guild', guildSchema, 'guilds');