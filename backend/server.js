const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    res.send({
        message: "Signup endpoint working",
        data: {name, email}
    })
})

app.listen(port, () => console.log(`Server listening on ${port}`));