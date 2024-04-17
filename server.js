const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const e = require('cors');

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
        if (email === "" || email === null|| password ==="" || password===null) {
            return res.status(500).json({ msg: 'Informations not valide' });
        }
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

app.post('/sign', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, data) => {
        if (email === "" || email === null|| password ==="" || password===null) {
            return res.status(500).json({ msg: 'Informations not valide' });
        }
        if (err) {
            console.log("Database error: " + err);
            return res.status(500).json({ msg: "Server side error" });
        }
        if (data.length === 0) {
            const sql1 = "INSERT INTO users(email,password) VALUES (?,?)";
            db.query(sql1, [email, password], (err, result) => {
                if (err) {
                    console.log("Database error: " + err);
                    return res.status(500).json({ msg: "Server side error" });
                }
                if (result.affectedRows > 0) {
                    return res.json({ status: "Success" });
                } else {
                    return res.status(500).json({ msg: 'The creation failed' });
                }
            });
        } else {
            return res.status(400).json({ msg: 'The account already exists' });
        }
    });
});



app.listen(3006, () => {
    console.log("Listening at port 3006");
});