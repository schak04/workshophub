const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signup = async (req, res) => {
    try {
        const {name, email, password, role} = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({message: "Name, email, and password are all required fields"});
        }
        const userExists = await User.findOne({email});
        if (userExists) return res.status(400).json({message: "Email already registered"});

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({name, email, password: hashedPassword, role: role || 'participant'});
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN || '7d'});
        
        res.status(201).json({message: "User created successfully", user:{id:user._id, name: user.name, email: user.email, role: user.role}, token});

    }
    catch (err) {
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
};

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) return res.status(400).json({message: "Email and password are both required"});
        const user = await User.findOne({email});
        if (!user) return res.status(400).json({message: "Invalid credentials"});

        const passwordOkay = await bcrypt.compare(password, user.password);
        if (!passwordOkay) return res.status(400).json({message: "Invalid credentials"});

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN || '7d'});
        res.json({message: "Login successful", token, user: {id: user._id, name: user.name, email: user.email, role: user.role}});
    }
    catch (err) {
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
};

const logout = async (req, res) => {
    res.json({message: "Logout successful. Client should remove token from storage."})
}

module.exports = {signup, login, logout};