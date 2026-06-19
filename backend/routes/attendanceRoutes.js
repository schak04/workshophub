const express = require('express');
const router = express.Router();
const {markAttendance, getAttendanceByWorkshop, getMyAttendance} = require('../controllers/attendanceController');
const {verifyToken, requireRole} = require('../middleware/authMiddleware');

router.post('/mark', verifyToken, requireRole(['instructor', 'admin']), markAttendance);
router.get('/my', verifyToken, requireRole('participant'), getMyAttendance);
router.get('/workshop/:workshopId', verifyToken, requireRole(['instructor', 'admin']), getAttendanceByWorkshop);

module.exports = router;