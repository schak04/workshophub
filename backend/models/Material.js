const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
    workshop: {type: mongoose.Schema.Types.ObjectId, ref: 'Workshop', required: true},
    title: String,
    file_url: String,
    upload_date: {type: Date, default: Date.now},
    uploaded_by: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
}, {timestamps: true});

module.exports = mongoose.model('Material', MaterialSchema);