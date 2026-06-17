const Certificate = require('../models/Certificate');
const User = require('../models/User');
const PDFDocument = require('pdfkit');

const issueCertificate = async (req, res) => {
    try {
        const {workshop, userId} = req.body;
        if (!workshop || !userId) return res.status(400).json({message: "Workshop and user ID are BOTH required!!"});
        const cert = await Certificate.create({workshop, user: userId});
        res.status(201).json(cert);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({message: "Error issuing certificate"});
    }
};

const listCertificates = async (req, res) => {
    try {
        const filter = {};
        if (req.query.user) filter.user = req.query.user;
        if (req.query.workshop) filter.workshop = req.query.workshop;
        const certs = await Certificate.find(filter).populate('user', 'name email').populate('workshop', 'title date');
        res.json(certs);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({message: "Error listing certificates"});
    }
};

const downloadCertificate = async (req, res) => {
    try {
        const {certificateId} = req.params;
        const cert = await Certificate.findById(certificateId)
            .populate('user', 'name')
            .populate({
                path: 'workshop',
                select: 'title date instructor',
                populate: { path: 'instructor', select: 'name' }
            });

        if (!cert) return res.status(404).json({message: "Error 404: Certificate not found"});

        if (req.user.role === 'participant' && cert.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Forbidden: You CANNOT download someone else's certificate" });
        }
        
        if (!cert.certificate_url) {
            return res.status(500).json({ message: "Certificate unavailable" });
        }
        res.redirect(cert.certificate_url);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({message: "Error downloading certificate"});
    }
};

module.exports = {issueCertificate, listCertificates, downloadCertificate};