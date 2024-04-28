const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}));
app.use(cookieParser());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pharmacy"
});

// Login and sign up
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
            return res.json({ status: data[0].role });
        } else {
            return res.status(401).json({ msg: 'Authentication failed' });
        }
    });
});

app.post('/signup', (req, res) => {
    const { email, password,name } = req.body;
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, data) => {
        if (email === "" || email === null|| password ==="" || password===null || name === null) {
            return res.status(500).json({ msg: 'Informations not valide' });
        }
        if (err) {
            console.log("Database error: " + err);
            return res.status(500).json({ msg: "Server side error" });
        }
        if (data.length === 0) {
            const sql1 = "INSERT INTO users(name,email,password) VALUES (?,?)";
            db.query(sql1, [name,email, password], (err, result) => {
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

// Pharmacien dashboard
app.get('/pharmacien', (req, res) => {
    const sql = "SELECT * FROM medcationl";
    db.query(sql,(err,data)=>{
        if(err) return res.json("error:"+ err);
        else return res.json(data);
    })
});

app.post('/pharmacien/create-medication', (req, res) => {
    const sql = "INSERT INTO medcationl (`name`,`type`,`disease`) VALUES (?)";
    const value = [
        req.body.name,
        req.body.type,
        req.body.disease
    ]
    db.query(sql,[value],(err, data)=>{
        if(err) {
            return res.json("error:"+ err);
        }else return res.json(data);
    })
});

app.put('/pharmacien/update-medication/:id', (req, res) => {
    const sql = "UPDATE medcationl SET name=?, type=?, disease=? WHERE id=?";
    const value = [
        req.body.name,
        req.body.type,
        req.body.disease
    ]
    const Id =Number(req.params.id);
    db.query(sql,[...value,Id],(err, data)=>{
        if(err) {
            console.log(err);
            return res.json("error:"+ err);
        }else return res.json(data);
    })
});

app.delete('/pharmacien/delete-medication/:id', (req, res) => {
    // Implementation remains the same
    const sql = "DELETE FROM medcationl WHERE id=?";
    const Id =Number(req.params.id);
    db.query(sql,[Id],(err, data)=>{
        if(err) {
            console.log(err);
            return res.json("error:"+ err);
        }else return res.json(data);
    })
});

// Manager dashboard: Storage
app.get('/manager/storage', (req, res) => {
    // Implementation remains the same
    const sql = "SELECT * FROM stocke";
    db.query(sql,(err,data)=>{
        if(err) return res.json("error:"+ err);
        else return res.json(data);
    })
});

app.post('/manager/create-product', (req, res) => {
    // Implementation remains the same
    const sql = "INSERT INTO stocke (`name`,`count`,`exp`, `cat`) VALUES (?)";
    const value = [
        req.body.name,
        req.body.count,
        req.body.exp,
        req.body.cat
    ]
    db.query(sql,[value],(err, data)=>{
        if(err) {
            return res.json("error:"+ err);
        }else return res.json(data);
    })
});

app.delete('/manager/delete-product/:id', (req, res) => {
    // Implementation remains the same
    const sql = "DELETE FROM stocke WHERE id=?";
    const Id =Number(req.params.id);
    db.query(sql,[Id],(err, data)=>{
        if(err) {
            console.log(err);
            return res.json("error:"+ err);
        }else return res.json(data);
    })
});

app.put('/manager/update-product/:id', (req, res) => {
    // Implementation remains the same
    const sql = "UPDATE stocke SET name=?, count=?, exp=?, cat=? WHERE id=?";
    const value = [
        req.body.name,
        req.body.count,
        req.body.exp,
        req.body.cat
    ]
    const Id =Number(req.params.id);
    db.query(sql,[...value,Id],(err, data)=>{
        if(err) {
            console.log(err);
            return res.json("error:"+ err);
        }else return res.json(data);
    })
});

// Manager dashboard: Commands
app.get('/manager/commands', (req, res) => {
    // Implementation remains the same
    const sql = "SELECT * FROM command";
    db.query(sql,(err,data)=>{
        if(err) return res.json("error:"+ err);
        else return res.json(data);
    })
});

// Manager dashboard: Sellers
app.get('/manager/sellers', (req, res) => {
    // Implementation remains the same
    const sql = "SELECT * FROM `users` WHERE role = 'vendeur'";
    db.query(sql,(err,users)=>{
        if(err) return res.json("error:"+ err);
        else return res.json(users);
    })
});

app.post('/manager/create-seller', (req, res) => {
    // Implementation remains the same
    const value = [
        req.body.name,
        req.body.email,
        req.body.role
    ]
    const sql = "INSERT INTO users(name,email,role) VALUES (?)";
    db.query(sql,[value],(err, data)=>{
        if(err) {
            return res.json("error:"+ err);
        }else return res.json(data);
    })
});

app.put('/manager/update-seller/:id', (req, res) => {
    // Implementation remains the same
    const sql = "UPDATE users SET name=?, email=?, WHERE id=?";
    const value = [
        req.body.name,
        req.body.email,
    ]
    const Id =Number(req.params.id);
    db.query(sql,[...value,Id],(err, data)=>{
        if(err) {
            console.log(err);
            return res.json("error:"+ err);
        }else return res.json(data);
    })
});

// Delivery
app.get('/manager/delivery', (req, res) => {
    // Implementation remains the same
    const sql = "SELECT * FROM users WHERE role = 'fournisseur' ";
    db.query(sql,(err,users)=>{
        if(err) return res.json("error:"+ err);
        else return res.json(users);
    })
});

// Start the server
app.listen(3006, () => {
    console.log("Server is running on port 3006");
});
