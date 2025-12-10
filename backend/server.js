const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./src/config/db');

const app = express();
const port = process.env.PORT || 8000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send({ message: 'Workshop Management System' }));

app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    res.send({
        message: "Signup endpoint working",
        data: {name, email}
    })
})
app.post('/login', (req, res) => {
    const {email, password} = req.body;
    res.send({
        message: "Login endpoint working",
        email
    })
})
app.post('/logout', (req, res) => {
    res.send({
        message: "Logout endpoint working"
    })
})

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ error: 'Server error' });
});

app.listen(port, () => console.log(`Server listening on ${port}`));