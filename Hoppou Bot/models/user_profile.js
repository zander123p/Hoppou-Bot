const mongoose = require('mongoose');

const user_profileSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: String,
    title: String,
    currentBg: Number,
    currentFlare: Number,
    animated: Boolean,
});

module.exports = mongoose.model('User Profile', user_profileSchema, 'user_profiles');