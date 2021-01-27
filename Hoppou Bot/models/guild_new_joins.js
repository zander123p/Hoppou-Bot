const mongoose = require('mongoose');

const guild_new_joins_logSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: String,
    guildID: String,
    messageID: String,
    when: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Guild New Joins', guild_new_joins_logSchema, 'guild_new_joins');