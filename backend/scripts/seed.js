const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/User');
const Workshop = require('../models/Workshop');
const Registration = require('../models/Registration');
const Attendance = require('../models/Attendance');
const Material = require('../models/Material');
const Feedback = require('../models/Feedback');
const Certificate = require('../models/Certificate');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) throw new Error('MONGO_URI not set in env');
        await mongoose.connect(uri);
        console.log('MongoDB connected for seeding');
    } catch (err) {
        console.error('MongoDB connection error: ', err.message);
        process.exit(1);
    }
};

const seedUsers = async () => {
    await connectDB();

    try {
        await User.deleteMany({});
        console.log('Existing users cleared');

        const defaultPassword = 'password123';
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        const users = [
            {
                name: 'Saptaparno Chakraborty',
                email: 'sapto@workshophub.com',
                password: hashedPassword,
                role: 'admin'
            },
            {
                name: 'Gwyn Lord of Cinder',
                email: 'gwyn@workshophub.com',
                password: hashedPassword,
                role: 'instructor'
            },
            {
                name: 'Marin Kitagawa',
                email: 'marin@workshophub.com',
                password: hashedPassword,
                role: 'instructor'
            },
            {
                name: 'Ada Lovelace',
                email: 'ada@workshophub.com',
                password: hashedPassword,
                role: 'instructor'
            },
            {
                name: 'Linus Torvalds',
                email: 'linus@workshophub.com',
                password: hashedPassword,
                role: 'instructor'
            },
            {
                name: 'Hornet',
                email: 'hornet@workshophub.com',
                password: hashedPassword,
                role: 'instructor'
            },
            {
                name: 'The Knight',
                email: 'knight@workshophub.com',
                password: hashedPassword,
                role: 'participant'
            },
            {
                name: 'Artorias the Abysswalker',
                email: 'artorias@workshophub.com',
                password: hashedPassword,
                role: 'participant'
            },
            {
                name: 'Solaire of Astora',
                email: 'solaire@workshophub.com',
                password: hashedPassword,
                role: 'participant'
            },
            {
                name: 'Naruto Uzumaki',
                email: 'naruto@workshophub.com',
                password: hashedPassword,
                role: 'participant'
            },
            {
                name: 'Panam Palmer',
                email: 'panam@workshophub.com',
                password: hashedPassword,
                role: 'participant'
            },
            {
                name: 'Dennis Ritchie',
                email: 'dennis@workshophub.com',
                password: hashedPassword,
                role: 'participant'
            },
            {
                name: 'Grace Hopper',
                email: 'grace@workshophub.com',
                password: hashedPassword,
                role: 'participant'
            },
            {
                name: 'Donald Knuth',
                email: 'donald@workshophub.com',
                password: hashedPassword,
                role: 'participant'
            },
            {
                name: 'Ken Thompson',
                email: 'ken@workshophub.com',
                password: hashedPassword,
                role: 'participant'
            }
        ];

        await User.insertMany(users);
        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database: ', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    }
};

seedUsers();
