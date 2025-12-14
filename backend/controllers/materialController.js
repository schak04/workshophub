const Material = require('../models/Material');

const addMaterial = async (req, res) => {
    try {
        const {workshop, title, file_url} = req.body;
        if (!workshop || !file_url) return res.status(400).json({message: "workshop and file_url required"});

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
        if (req.query.workshop) filter.workshop = req.query.workshop;
        const materials = await Material.find(filter).populate('uploaded_by', 'name email');
        res.json(materials);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({message: "Error fetching materials"});
    }
};

module.exports = {addMaterial, listMaterials};