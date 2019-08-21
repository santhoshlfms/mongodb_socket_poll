const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TrackerSchema = mongoose.Schema({
    title: String,
    recordId: Number,
    data: Schema.Types.Mixed
});

module.exports = mongoose.model('tracker', TrackerSchema);