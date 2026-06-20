const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const workshopRoutes = require('./routes/workshopRoutes');
const materialRoutes = require('./routes/materialRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
app.get('/', (req, res) => res.send({ message: "WorkshopHub" }));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/workshops', workshopRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/certificates', certificateRoutes);

app.get('/api/stats', async (req, res) => {
    try {
        const [w, p, c, tA, pA] = await Promise.all([
            require('./models/Workshop').countDocuments(),
            require('./models/User').countDocuments({ role: 'participant' }),
            require('./models/Certificate').countDocuments(),
            require('./models/Attendance').countDocuments({ attended: { $ne: null } }),
            require('./models/Attendance').countDocuments({ attended: true })
        ]);
        const attRate = tA > 0 ? Math.round((pA / tA) * 100) : 0;
        res.json({ workshops: w, participants: p, certificates: c, attendance: attRate });
    } catch (e) {
        res.status(500).json({ error: "Server error" });
    }
});

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send({ error: "Server error" });
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server listening on ${port}`));