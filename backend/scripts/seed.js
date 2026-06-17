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

const seed = async () => {
    await connectDB();

    try {
        await User.deleteMany({});
        await Workshop.deleteMany({});
        await Registration.deleteMany({});
        await Attendance.deleteMany({});
        await Material.deleteMany({});
        await Feedback.deleteMany({});
        await Certificate.deleteMany({});
        console.log('Cleared existing data');

        const defaultPassword = 'password123';
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        const adminUser = await User.create({
            name: 'Saptaparno Chakraborty',
            email: 'sapto@workshophub.com',
            password: hashedPassword,
            role: 'admin'
        });

        const instructorsData = [
            { name: 'Linus Torvalds', email: 'linus@workshophub.com', password: hashedPassword, role: 'instructor' },
            { name: 'Ada Lovelace', email: 'ada@workshophub.com', password: hashedPassword, role: 'instructor' },
            { name: 'Grace Hopper', email: 'grace@workshophub.com', password: hashedPassword, role: 'instructor' },
            { name: 'Dennis Ritchie', email: 'dennis@workshophub.com', password: hashedPassword, role: 'instructor' },
            { name: 'Donald Knuth', email: 'donald@workshophub.com', password: hashedPassword, role: 'instructor' },
            { name: 'Ken Thompson', email: 'ken@workshophub.com', password: hashedPassword, role: 'instructor' }
        ];
        const instructors = await User.insertMany(instructorsData);

        const namedParticipantsData = [
            { name: 'Solaire of Astora', email: 'solaire@workshophub.com', password: hashedPassword, role: 'participant' },
            { name: 'Hornet', email: 'hornet@workshophub.com', password: hashedPassword, role: 'participant' },
            { name: 'Panam Palmer', email: 'panam@workshophub.com', password: hashedPassword, role: 'participant' },
            { name: 'Gwyn Lord of Cinder', email: 'gwyn@workshophub.com', password: hashedPassword, role: 'participant' },
            { name: 'Faye Valentine', email: 'gojo@workshophub.com', password: hashedPassword, role: 'participant' },
            { name: 'The Knight', email: 'knight@workshophub.com', password: hashedPassword, role: 'participant' },
            { name: 'Artorias the Abysswalker', email: 'artorias@workshophub.com', password: hashedPassword, role: 'participant' },
            { name: 'Makise Kurisu', email: 'kurisu@workshophub.com', password: hashedPassword, role: 'participant' },
            { name: 'Marin Kitagawa', email: 'marin@workshophub.com', password: hashedPassword, role: 'participant' }
        ];

        const dummyParticipantsData = [];
        for (let i = 1; i <= 36; i++) {
            dummyParticipantsData.push({
                name: 'Test Participant ' + i,
                email: 'dummy' + i + '@workshophub.com',
                password: hashedPassword,
                role: 'participant'
            });
        }

        const participants = await User.insertMany([...namedParticipantsData, ...dummyParticipantsData]);

        const instructorMap = {};
        instructors.forEach(inst => {
            instructorMap[inst.name] = inst._id;
        });

        const workshopsData = [
            {
                title: 'Kernel Development in C',
                description: 'A deep dive into kernel architecture, memory management, and process scheduling.',
                date: new Date('2026-06-25'),
                time: '2:00 PM - 5:00 PM',
                venue: 'Room A-301',
                seats: 30,
                instructor: instructorMap['Linus Torvalds']
            },
            {
                title: 'Systems Programming and UNIX',
                description: 'Learn system calls, file systems, and multi-process communication in C.',
                date: new Date('2026-06-17'),
                time: '10:00 AM - 1:00 PM',
                venue: 'Lab B-105',
                seats: 50,
                instructor: instructorMap['Dennis Ritchie']
            },
            {
                title: 'Compiler Design and COBOL',
                description: 'Explore the internals of compiler construction, lexical analysis, and code generation.',
                date: new Date('2026-06-13'),
                time: '1:00 PM - 4:00 PM',
                venue: 'Design Studio',
                seats: 25,
                instructor: instructorMap['Grace Hopper']
            },
            {
                title: 'Algorithms and Analytical Programming',
                description: 'Study the first computer algorithm, mechanical calculation, and computational complexity.',
                date: new Date('2026-06-27'),
                time: '9:00 AM - 12:00 PM',
                venue: 'Virtual',
                seats: 40,
                instructor: instructorMap['Ada Lovelace']
            }
        ];

        const workshops = await Workshop.insertMany(workshopsData);

        const workshopMap = {};
        workshops.forEach(w => {
            workshopMap[w.title] = w;
        });

        const createRegistrations = async (wTitle, count) => {
            const w = workshopMap[wTitle];
            const regs = [];
            for (let i = 0; i < count; i++) {
                regs.push({
                    workshop: w._id,
                    user: participants[i]._id,
                    registration_date: new Date()
                });
            }
            return await Registration.insertMany(regs);
        };

        const kernelRegs = await createRegistrations('Kernel Development in C', 28);
        const unixRegs = await createRegistrations('Systems Programming and UNIX', 45);
        const compilerRegs = await createRegistrations('Compiler Design and COBOL', 22);
        const algoRegs = await createRegistrations('Algorithms and Analytical Programming', 35);

        const attendanceData = [];
        for (let i = 0; i < compilerRegs.length; i++) {
            attendanceData.push({
                registration: compilerRegs[i]._id,
                attended: i < 20
            });
        }
        for (let i = 0; i < unixRegs.length; i++) {
            attendanceData.push({
                registration: unixRegs[i]._id,
                attended: i < 40
            });
        }
        await Attendance.insertMany(attendanceData);

        const materialsData = [
            {
                workshop: workshopMap['Kernel Development in C']._id,
                title: 'Kernel Architecture Slides',
                file_url: 'https://example.com/kernel-handout.pdf',
                uploaded_by: instructorMap['Linus Torvalds']
            },
            {
                workshop: workshopMap['Systems Programming and UNIX']._id,
                title: 'UNIX Programming Manual',
                file_url: 'https://example.com/unix-manual.pdf',
                uploaded_by: instructorMap['Dennis Ritchie']
            },
            {
                workshop: workshopMap['Compiler Design and COBOL']._id,
                title: 'First Compiler Specification',
                file_url: 'https://example.com/compiler-spec.pdf',
                uploaded_by: instructorMap['Grace Hopper']
            },
            {
                workshop: workshopMap['Algorithms and Analytical Programming']._id,
                title: 'Analytical Engine Diagram',
                file_url: 'https://example.com/analytical-engine.pdf',
                uploaded_by: instructorMap['Ada Lovelace']
            }
        ];
        await Material.insertMany(materialsData);

        const feedbackData = [
            {
                workshop: workshopMap['Compiler Design and COBOL']._id,
                user: participants[0]._id,
                rating: 4,
                comment: 'Very nice templates, helped me start immediately.'
            },
            {
                workshop: workshopMap['Compiler Design and COBOL']._id,
                user: participants[1]._id,
                rating: 5,
                comment: 'Fascinating session! The design guidelines were clear and very modern.'
            },
            {
                workshop: workshopMap['Compiler Design and COBOL']._id,
                user: participants[2]._id,
                rating: 5,
                comment: 'Great presentation and clear explanations.'
            },
            {
                workshop: workshopMap['Compiler Design and COBOL']._id,
                user: participants[3]._id,
                rating: 4,
                comment: 'Good structure, though a bit fast on the prototyping part.'
            }
        ];
        await Feedback.insertMany(feedbackData);

        const certificatesData = [];
        for (let i = 0; i < 20; i++) {
            certificatesData.push({
                workshop: workshopMap['Compiler Design and COBOL']._id,
                user: participants[i]._id,
                certificate_url: 'https://example.com/certs/cert_' + participants[i]._id + '.pdf',
                issued_date: new Date()
            });
        }
        await Certificate.insertMany(certificatesData);

        console.log('Database successfully seeded with all dummy data');
    } catch (error) {
        console.error('Error seeding database: ', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    }
};

seed();
