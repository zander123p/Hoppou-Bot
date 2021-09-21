const mongoose = require('mongoose');

const infoSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    botID: String,
    version: String,
}, {
    typeKey: '$type',
});

module.exports = mongoose.model('Info', infoSchema, 'info');