const mongoose = require('mongoose');

const action_logSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: String,
    guildID: String,
    type: String,
    moderator: String,
    reason: String,
    when: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Action Log', action_logSchema, 'action_logs');