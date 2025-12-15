const Registration = require('../models/Registration');

const registerForWorkshop = async (req, res) => {
    try {
        const {workshopId} = req.body;
        if (!workshopId) return res.status(400).json({message:"Please provide the workshop ID as it is required"});

        const alreadyRegistered = await Registration.findOne({workshop: workshopId, user: req.user._id});
        if (alreadyRegistered) return res.status(400).json({message: "You've already registered for this workshop"});

        const reg = await Registration.create({workshop: workshopId, user: req.user._id});
        res.status(201).json(reg);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({message: "Error registering"});
    }
};

const listRegistrations = async (req, res) => {
    try {
        const filter = {}; // optional ?workshop=<id> query filter
        if (req.query.workshop) filter.workshop = req.query.workshop;
        if (req.user.role === 'participant') filter.user = req.user._id;

        const regs = await Registration.find(filter).populate('workshop').populate('user', 'name email');
        res.json(regs);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({message: "Error listing registrations"});
    }
};

module.exports = {registerForWorkshop, listRegistrations};