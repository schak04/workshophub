const Registration = require('../models/Registration');

const registerForWorkshop = async (req, res) => {
    try {
        const {workshopId} = req.body;
        if (!workshopId) return res.status(400).json({message:"Please provide the workshop ID as it is required"});

        const alreadyRegistered = await Registration.findOne({workshop: workshopId, user: req.user._id, status: 'registered'});
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
        const filter = {};
        if (req.user.role === 'participant') {
            filter.user = req.user._id;
            if (req.query.workshop) filter.workshop = req.query.workshop;
        } else if (req.user.role === 'instructor') {
            const Workshop = require('../models/Workshop');
            const myWorkshops = await Workshop.find({instructor: req.user._id}).select('_id');
            const myWorkshopIds = myWorkshops.map(w => w._id.toString());
            
            if (req.query.workshop) {
                if (!myWorkshopIds.includes(req.query.workshop)) {
                    return res.json([]);
                }
                filter.workshop = req.query.workshop;
            } else {
                filter.workshop = { $in: myWorkshopIds };
            }
        } else {
            if (req.query.workshop) filter.workshop = req.query.workshop;
        }

        const regs = await Registration.find(filter).populate('workshop').populate('user', 'name email');
        res.json(regs);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({message: "Error listing registrations"});
    }
};

const unregisterFromWorkshop = async (req, res) => {
    try {
        const {registrationId} = req.params;
        const reg = await Registration.findOneAndUpdate(
            {_id: registrationId, user: req.user._id, status: 'registered'},
            {status: 'cancelled'},
            {new: true}
        );
        if (!reg) return res.status(404).json({message: "Registration not found or already cancelled"});
        res.json({message: "Unregistered successfully", reg});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Error unregistering"});
    }
};

module.exports = {registerForWorkshop, listRegistrations, unregisterFromWorkshop};