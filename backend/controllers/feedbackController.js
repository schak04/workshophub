const Feedback = require('../models/Feedback');
const Workshop = require('../models/Workshop');
const mongoose = require('mongoose');

const addFeedback = async (req, res) => {
    try {
        const {workshop, rating, comment} = req.body;
        if (!workshop || !rating) return res.status(400).json({message: "Workshop and rating are both required"});

        const f = await Feedback.create({workshop, user: req.user._id, rating, comment});
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