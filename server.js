const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET","PUT","DELETE"],
    credentials: true
}));  

app.use(cookieParser());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pharmacy"
});
//login and sign up
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
//pharmacien dash
app.get('/pharmacien',(req,res)=>{
    const sql = "SELECT * FROM medcationl";
    db.query(sql,(err,data)=>{
        if(err) return res.json("error:"+ err);
        else return res.json(data);
    })
})

app.post("/create10meQd",(req, res)=>{
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
})

app.put("/upda12te-med/:id",(req, res)=>{
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
})

app.delete("/delete/:id",(req, res)=>{
    const sql = "DELETE FROM medcationl WHERE id=?";
    const Id =Number(req.params.id);
    db.query(sql,[Id],(err, data)=>{
        if(err) {
            console.log(err);
            return res.json("error:"+ err);
        }else return res.json(data);
    })
})
//manager dash : storage 
app.get("/maçna§g2er°/stor-§age",(req,res)=>{
    const sql = "SELECT * FROM stocke";
    db.query(sql,(err,data)=>{
        if(err) return res.json("error:"+ err);
        else return res.json(data);
    })
})

app.post("/maçna§g2er°/create10meQd",(req, res)=>{
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
})

app.delete("/maçna§g2er°/d§el§et§eProd/:id",(req, res)=>{
    const sql = "DELETE FROM stocke WHERE id=?";
    const Id =Number(req.params.id);
    db.query(sql,[Id],(err, data)=>{
        if(err) {
            console.log(err);
            return res.json("error:"+ err);
        }else return res.json(data);
    })
})

app.put("/upda12te-med/:id",(req, res)=>{
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
})
//manager dash : commands
app.get("/maçna§g2er°/com§and§d",(req,res)=>{
    const sql = "SELECT * FROM command";
    db.query(sql,(err,data)=>{
        if(err) return res.json("error:"+ err);
        else return res.json(data);
    })
})
//seller dash
app.get("/maçna§g2er°/S§all§Er",(req,res)=>{
    const sql = "SELECT * FROM user WHERE role = 'vendeur' ";
    db.query(sql,(err,data)=>{
        if(err) return res.json("error:"+ err);
        else return res.json(data);
    })
})

app.post("/maçna§g2er°/create10SallER",(req,res)=>{
    const sql = "INSERT INTO user (`name`,`gmail`,`role`) VALUES (?)";
    const value = [
        req.body.name,
        req.body.gmail,
        req.body.role
    ]
    db.query(sql,[value],(err, data)=>{
        if(err) {
            return res.json("error:"+ err);
        }else return res.json(data);
    })
})

app.put("/maçna§g2er°/upda12te10SallER/:id", (req,res)=>{
    const sql = "UPDATE user SET name=?, gmail=?, WHERE id=?";
    const value = [
        req.body.name,
        req.body.gmail,
    ]
    const Id =Number(req.params.id);
    db.query(sql,[...value,Id],(err, data)=>{
        if(err) {
            console.log(err);
            return res.json("error:"+ err);
        }else return res.json(data);
    })
})
//delivery
app.get('/maçna§g2er°/del!iv§ery',(req,res)=>{
    const sql = "SELECT * FROM user WHERE role = 'fournisseur' ";
    db.query(sql,(err,data)=>{
        if(err) return res.json("error:"+ err);
        else return res.json(data);
    })
})



app.listen(3006, () => {
    console.log("Listening at port 3006");
});
