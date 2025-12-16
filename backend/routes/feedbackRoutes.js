const express = require('express');
const router = express.Router();
const {addFeedback, listFeedback} = require('../controllers/feedbackController');
const {verifyToken, requireRole} = require('../middleware/authMiddleware');

router.post('/', verifyToken, requireRole('participant'), addFeedback);
router.get('/', verifyToken, requireRole('admin'), listFeedback);

module.exports = router;