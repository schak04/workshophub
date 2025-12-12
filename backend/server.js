const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');

const app = express();
const port = process.env.PORT || 8000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send({ message: 'Workshop Management System' }));

app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ error: 'Server error' });
});

app.listen(port, () => console.log(`Server listening on ${port}`));