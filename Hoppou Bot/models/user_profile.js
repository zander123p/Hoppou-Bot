const mongoose = require('mongoose');

const user_profileSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: String,
    totalActions: Number,
    mutes: Number,
    warnings: [String],
    kicks: [String],
    bans: [String],
});

module.exports = mongoose.model('User Profile', user_profileSchema, 'user_profiles');