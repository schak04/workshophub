const Attendance = require('../models/Attendance');
const Registration = require('../models/Registration');
const Workshop = require('../models/Workshop');

const markAttendance = async (req, res) => {
    try {
        const {registrationId, date, attended} = req.body;
        if (!registrationId || !date) res.status(400).json({message: "Can't mark attendance without registration ID and date"});
        
        const reg = await Registration.findById(registrationId).populate('workshop');
        if (!reg) return res.status(404).json({message: "Error 404: Registration not found"});
        if (req.user.role === 'instructor') {
            if (reg.workshop.instructor.toString() !== req.user.id) {
                return res.status(403).json({message: "You are not allowed to mark attendance for this workshop"});
            }
        }

        const targetDate = new Date(date);
        targetDate.setUTCHours(0,0,0,0);

        let att = await Attendance.findOne({
            registration: registrationId, 
            date: targetDate
        });
        
        if (!att) {
            att = await Attendance.create({
                registration: registrationId, 
                date: targetDate,
                attended: attended
            });
        }
        else {
            att.attended = attended;
            await att.save();
        }
        res.json(att);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({message: "Error marking attendance"});
    }
};

const getAttendanceByWorkshop = async (req, res) => {
    try {
        const workshopId = req.params.workshopId;
        const workshop = await Workshop.findById(workshopId);
        if (!workshop) return res.status(404).json({ message: "Workshop not found" });
        if (req.user.role === 'instructor') {
            if (workshop.instructor.toString()!==req.user.id) {
                return res.status(403).json({message: "You are not allowed to view attendance for this workshop"});
            }
        }
        const { date } = req.query;
        if (!date) return res.status(400).json({message: "Date query parameter is required"});
        
        const targetDateStart = new Date(date);
        targetDateStart.setUTCHours(0,0,0,0);
        const targetDateEnd = new Date(date);
        targetDateEnd.setUTCHours(23,59,59,999);

        const regs = await Registration.find({workshop: workshopId});
        const regIds = regs.map(r=>r._id);
        const attendance = await Attendance.find({
            registration: {$in: regIds},
            date: { $gte: targetDateStart, $lte: targetDateEnd }
        }).populate({
            path: 'registration',
            populate: {path: 'user', select: 'name email'}
        });
        res.json(attendance);
    }
    catch(err) {
        console.error(err);
        res.status(500).json({message: "Error fetching attendance details"});
    }
};

const getMyAttendance = async (req, res) => {
    try {
        const registrations = await Registration.find({
            user: req.user._id,
            status: 'registered'
        }).populate('workshop', 'title startDate endDate');

        const regIds = registrations.map(r => r._id);
        const attendanceRecords = await Attendance.find({registration: {$in: regIds}}).sort({date: 1});

        const attMap = new Map();
        attendanceRecords.forEach(a => {
            const rid = a.registration.toString();
            if (!attMap.has(rid)) attMap.set(rid, []);
            attMap.get(rid).push({ date: a.date, attended: a.attended });
        });

        const result = registrations.map(reg => ({
            registration: reg._id,
            workshop: reg.workshop,
            records: attMap.get(reg._id.toString()) || []
        }));

        res.json(result);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({message: "Error fetching attendance"});
    }
};

module.exports = {markAttendance, getAttendanceByWorkshop, getMyAttendance};