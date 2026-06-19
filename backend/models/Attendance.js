const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    registration: {type: mongoose.Schema.Types.ObjectId, ref: 'Registration', required: true},
    attended: {type: Boolean},
    date: {type: Date, required: true}
});

module.exports = mongoose.model('Attendance', AttendanceSchema);