const Certificate = require('../models/Certificate');
const User = require('../models/User');
const Registration = require('../models/Registration');
const PDFDocument = require('pdfkit');

const issueCertificate = async (req, res) => {
    try {
        const {workshop, userId} = req.body;
        if (!workshop || !userId) return res.status(400).json({message: "Workshop and user ID are BOTH required!!"});

        const targetUser = await User.findById(userId).select('role');
        if (!targetUser) return res.status(404).json({message: "User not found"});
        if (targetUser.role !== 'participant') return res.status(400).json({message: "Certificates can only be issued to participants"});

        const isRegistered = await Registration.findOne({workshop, user: userId, status: 'registered'});
        if (!isRegistered) return res.status(400).json({message: "User is not registered for this workshop"});

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
        if (req.user.role === 'participant') {
            filter.user = req.user._id;
        } else {
            if (req.query.user) filter.user = req.query.user;
            if (req.query.workshop) filter.workshop = req.query.workshop;
        }
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

        /*
        ---- Certificate PDF ----
        for future ref: https://pdfkit.org/docs/getting_started.html
        */

        const adminUser = await User.findOne({ role: 'admin' });
        const adminName = adminUser ? adminUser.name : 'Administrator';
        const instructorName = cert.workshop.instructor?.name || 'Instructor';

        const doc = new PDFDocument({
            layout: 'landscape',
            size: 'A4',
            margin: 50
        });

        const filename = `Certificate_${cert.user.name.replace(/\s+/g, '_')}_${cert.workshop.title.replace(/\s+/g, '_')}.pdf`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        doc.pipe(res);

        const W = doc.page.width;
        const H = doc.page.height;

        doc.rect(20, 20, W - 40, H - 40).stroke('#1e293b');
        doc.rect(25, 25, W - 50, H - 50).stroke('#64748b');

        doc.moveDown(4);
        doc.font('Helvetica-Bold').fontSize(13).fillColor('#0d9488').text('WorkshopHub', { align: 'center' });
        doc.moveDown(0.4);
        doc.font('Helvetica-Bold').fontSize(34).fillColor('#0f172a').text('CERTIFICATE', { align: 'center' });
        doc.font('Helvetica').fontSize(16).fillColor('#475569').text('OF COMPLETION', { align: 'center' });

        doc.moveDown(2);
        doc.font('Helvetica').fontSize(13).fillColor('#475569').text('This is to certify that', { align: 'center' });

        doc.moveDown(0.4);
        doc.font('Helvetica-Bold').fontSize(26).fillColor('#0d9488').text(cert.user.name.toUpperCase(), { align: 'center' });

        doc.moveDown(0.4);
        doc.font('Helvetica').fontSize(13).fillColor('#475569').text('has successfully completed the workshop', { align: 'center' });

        doc.moveDown(0.4);
        doc.font('Helvetica-Bold').fontSize(18).fillColor('#0f172a').text(cert.workshop.title, { align: 'center' });

        doc.moveDown(1.2);
        const date = new Date(cert.issued_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        doc.font('Helvetica').fontSize(11).fillColor('#475569').text(`Issued on ${date}`, { align: 'center' });

        const sigY = H - 110;
        const colWidth = 180;
        const leftX = W / 4 - colWidth / 2;
        const rightX = (3 * W) / 4 - colWidth / 2;

        const drawSignatory = (x, y, name, title) => {
            doc.font('Helvetica-Bold').fontSize(11).fillColor('#0f172a').text(name, x, y, { width: colWidth, align: 'center' });
            doc.font('Helvetica').fontSize(9).fillColor('#64748b').text(title, x, y + 16, { width: colWidth, align: 'center' });
        };

        drawSignatory(leftX, sigY, instructorName, 'Instructor');
        drawSignatory(rightX, sigY, adminName, 'Administrator');

        doc.end();
    }
    catch (err) {
        console.error(err);
        res.status(500).json({message: "Error downloading certificate"});
    }
};

module.exports = {issueCertificate, listCertificates, downloadCertificate};