const Feedback = require('../models/Feedback');
const Workshop = require('../models/Workshop');
const Registration = require('../models/Registration');
const Attendance = require('../models/Attendance');
const mongoose = require('mongoose');

const addFeedback = async (req, res) => {
    try {
        const {workshop, rating, comment} = req.body;
        if (!workshop || !rating) return res.status(400).json({message: "Workshop and rating are both required"});

        const parsedRating = parseInt(rating, 10);
        if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
            return res.status(400).json({message: "Rating must be an integer between 1 and 5"});
        }

        const w = await Workshop.exists({_id: workshop});
        if (!w) return res.status(404).json({message: "Workshop not found"});

        const existing = await Feedback.findOne({workshop, user: req.user._id});
        if (existing) return res.status(400).json({message: "You have already submitted feedback for this workshop"});

        const reg = await Registration.findOne({workshop, user: req.user._id, status: 'registered'});
        if (!reg) return res.status(403).json({message: "Forbidden: You are not registered for this workshop"});

        const attendance = await Attendance.findOne({registration: reg._id, attended: true});
        if (!attendance) return res.status(403).json({message: "Forbidden: You cannot review a workshop you did not attend"});

        const f = await Feedback.create({workshop, user: req.user._id, rating: parsedRating, comment});
        res.status(201).json(f);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({message: "Error adding feedback"});
    }
};

const listFeedback = async (req, res) => {
    try {
        const filter = {};
        if (req.user.role === 'participant') {
            filter.user = req.user._id;
        } else if (req.user.role === 'instructor') {
            const myWorkshops = await Workshop.find({instructor: req.user._id}).select('_id');
            const myWorkshopIds = myWorkshops.map(w => w._id);
            filter.workshop = { $in: myWorkshopIds };
            if (req.query.workshop && req.query.workshop !== '') filter.workshop = req.query.workshop;
        } else {
            if (req.query.workshop && req.query.workshop !== '') filter.workshop = req.query.workshop;
        }
        const f = await Feedback.find(filter).populate('user', 'name email').populate('workshop', 'title instructor');
        res.json(f);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({message: "Error listing feedback"});
    }
};

module.exports = {addFeedback, listFeedback};