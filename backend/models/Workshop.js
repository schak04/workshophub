const mongoose = require('mongoose');

const WorkshopSchema = new mongoose.Schema({
    title: {type: String, required:true},
    description: String,
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    time: String,
    venue: String,
    seats: Number,
    instructor: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
}, {timestamps: true});

module.exports = mongoose.model('Workshop', WorkshopSchema);