const express = require('express');
const router = express.Router();
const {verifyToken, requireRole} = require('../middleware/authMiddleware');
const {issueCertificate, listCertificates, downloadCertificate} = require('../controllers/certificateController');

router.post('/', verifyToken, requireRole('admin'), issueCertificate);
router.get('/', verifyToken, listCertificates);
router.get('/download/:certificateId', verifyToken, requireRole('participant'), downloadCertificate);

module.exports = router;