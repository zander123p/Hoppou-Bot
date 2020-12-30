const mongoose = require('mongoose');

const action_logSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: String,
    guildID: String,
    muteTime: String,
    when: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Mute Log', action_logSchema, 'mute_logs');