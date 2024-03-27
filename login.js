const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true
}));  

app.use(cookieParser());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pharmacy"
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    const values = [email, password];
    db.query(sql, values, (err, data) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ msg: "Server side error" });
        }
        if (data.length > 0) {
            const name = data[0].email;
            const token = jwt.sign({ name }, "our-jsonwebtoken-secret-key", { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true });
            return res.json({ status: "Success" });
        } else {
            return res.status(401).json({ msg: 'Authentication failed' });
        }
    });
});

app.listen(3006, () => {
    console.log("Listening at port 3006");
});
