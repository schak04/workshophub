const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, rquired: true},
    role: {type: String, enum: ['admin', 'instructor', 'participant'], default: 'participant'}
}, {timestamps: true});

module.exports = mongoose.model('User', UserSchema);