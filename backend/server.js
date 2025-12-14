const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const workshopRoutes = require('./routes/workshopRoutes');
const materialRoutes = require('./routes/materialRoutes');
app.get('/', (req, res) => res.send({ message: "Workshop Management System" }));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/workshops', workshopRoutes);
app.use('/api/materials', materialRoutes);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send({ error: "Server error" });
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server listening on ${port}`));