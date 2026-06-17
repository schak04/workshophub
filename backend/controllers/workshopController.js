const Workshop = require('../models/Workshop');
const Registration = require('../models/Registration');

const createWorkshop = async (req, res) => {
    try {
        const data = req.body;
        const workshop = await Workshop.create(data);
        res.status(201).json(workshop);
    }
    catch(err) {
        console.error(err);
        res.status(500).json({message: "Error creating workshop"});
    }
};

const updateWorkshop = async (req, res) => {
    try {
        const updated = await Workshop.findByIdAndUpdate(req.params.id, req.body, {new:true});
        if (!updated) return res.status(404).json({message: "Error 404: Workshop NOT found"});
        res.json(updated);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({message: "Error updating workshop"});
    }
};

const deleteWorkshop = async (req, res) => {
    try {
        const removed = await Workshop.findByIdAndDelete(req.params.id);
        if (!removed) return res.status(404).json({message: "Error 404: Workshop NOT found"});
        res.json({message: "Workshop deleted successfully"});
    }
    catch(err) {
        console.error(err);
        res.status(500).json({message:"Error deleting workshop"});
    }
};

const getWorkshop = async (req, res) => {
    try {
        const ws = await Workshop.findById(req.params.id).populate('instructor', 'name email');
        if (!ws) return res.status(404).json({message: "Error 404: Workshop NOT found"});
        const registrationCount = await Registration.countDocuments({workshop: ws._id});
        res.json({workshop: ws, registrations: registrationCount});
    }
    catch (err) {
        console.error(err);
        res.status(500).json({message:"Error fetching the requested workshop"});
    }
};

const getMyWorkshops = async (req, res) => {
    try {
        const workshops = await Workshop.find({
            instructor: req.user.id
        });

        res.json(workshops);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching instructor workshops" });
    }
};

const getWorkshops = async (req, res) => {
    try {
        const workshops = await Workshop.find().populate('instructor', 'name email role');
        const workshopsWithCount = await Promise.all(workshops.map(async (ws) => {
            const count = await Registration.countDocuments({ workshop: ws._id });
            const obj = ws.toObject();
            obj.current = count;
            return obj;
        }));
        res.json(workshopsWithCount);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({message:"Error fetching workshops"});
    }
};

module.exports = {createWorkshop, updateWorkshop, deleteWorkshop, getWorkshop, getMyWorkshops, getWorkshops};