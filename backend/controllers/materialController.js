const Material = require('../models/Material');
const Registration = require('../models/Registration');
const Workshop = require('../models/Workshop');

const addMaterial = async (req, res) => {
    try {
        const {workshop, title, file_url} = req.body;
        if (!workshop || !file_url) return res.status(400).json({message: "Workshop and file URL are required for adding material"});

        if (req.user.role === 'instructor') {
            const w = await Workshop.findById(workshop);
            if (!w) return res.status(404).json({message: "Workshop not found"});
            if (w.instructor.toString() !== req.user._id.toString()) {
                return res.status(403).json({message: "Forbidden: You can only upload materials to your own workshops"});
            }
        }

        const m = await Material.create({workshop, title, file_url, uploaded_by: req.user._id});
        res.status(201).json(m);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({message: "Error adding material"});
    }
};

const listMaterials = async (req, res) => {
    try {
        const filter = {};
        if (req.user.role === 'participant') {
            const registrations = await Registration.find({user: req.user._id, status: 'registered'}).select('workshop');
            const workshopIds = registrations.map(r => r.workshop.toString());
            
            if (req.query.workshop) {
                if (!workshopIds.includes(req.query.workshop)) {
                    return res.json([]);
                }
                filter.workshop = req.query.workshop;
            } else {
                filter.workshop = {$in: workshopIds};
            }
        } else if (req.user.role === 'instructor') {
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
        const materials = await Material.find(filter).populate('uploaded_by', 'name email');
        res.json(materials);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({message: "Error fetching materials"});
    }
};

module.exports = {addMaterial, listMaterials};