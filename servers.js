const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const app = express();


app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:3000', // Allow requests from this origin
    methods: ["POST", "GET", "PUT", "DELETE"], // Allow only specific methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow only specific headers
    credentials: true, // Allow cookies and credentials
};

app.use(cors(corsOptions));
app.use(cookieParser());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pharmacy"
});

function generateUniqueCommandNumber() {
    // Generate a random number between 1000 and 9999
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;

    // Construct a unique command number using the current timestamp and the random number
    const timestamp = Date.now(); // Current timestamp in milliseconds
    const uniqueNumber = timestamp.toString() + randomNumber.toString();

    return Number(uniqueNumber);
}
const date =  new Date()
const currentDate =date.toDateString();
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

app.post('/sign', (req, res) => {
    const { email, password,number,role } = req.body;
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, data) => {
        if (email === "" || email === null|| password ==="" || password===null || role === null) {
            return res.status(500).json({ msg: 'Informations not valide' });
        }
        if (err) {
            console.log("Database error: " + err);
            return res.status(500).json({ msg: "Server side error" });
        }
        if (data.length === 0) {
            const sql1 = "INSERT INTO users(email,password,num_tel,role) VALUES (?,?,?,?)";
            db.query(sql1, [email, password,number,role], (err, result) => {
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
    const sql = "SELECT * FROM `medicament_approuve`";
    db.query(sql,(err,data)=>{
        if(err) return res.json("error:"+ err);
        else return res.json(data);
    })
});

app.post('/pharmacien/create-medication', (req, res) => {
    const sql = "INSERT INTO medicament_approuve (`name`,`type`) VALUES (?)";
    const value = [
        req.body.name,
        req.body.type,
    ]
    db.query(sql,[value],(err, data)=>{
        if(err) {
            return res.json("error:"+ err);
        }else return res.json(data);
    })
});

app.put('/pharmacien/update-medication/:id', (req, res) => {
    const sql = "UPDATE medicament_approuve SET name=?, type=? WHERE id=?";
    const value = [
        req.body.name,
        req.body.type,
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
    const sql = "DELETE FROM medicament_approuve WHERE id=?";
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
    const sql = "SELECT id_s, nom, qte_stock,type, date_per FROM `stock`";
    db.query(sql,(err,data)=>{
        if(err) return res.json("error:"+ err);
        else return res.json(data);
    })
});

app.post('/manager/create-product', (req, res) => {
    // Implementation remains the same
    const sql = "INSERT INTO stock (`nom`,`type`,`qte_stock`,`price`, `date_per`) VALUES (?)";
    const value = [
        req.body.name,
        req.body.cat,
        req.body.count,
        req.body.price,
        req.body.date
    ]
    db.query(sql,[value],(err, data)=>{
        if(err) {
            return res.json("error:"+ err);
        }else return res.json(data);
    })
});

app.delete('/manager/delete-product/:id', (req, res) => {
    // Implementation remains the same
    const sql = "DELETE FROM stock WHERE id_s=?";
    const Id =Number(req.params.id);
    db.query(sql,[Id],(err, data)=>{
        if(err) {
            console.log(err);
            return res.json("error:"+ err);
        }else return res.json(data);
    })
});

app.put('/manager/update-product/:id', (req, res) => {
    const sql = "UPDATE stock SET nom=?, qte_stock=?, type=?, date_per=? WHERE id_s=?";
    const values = [
        req.body.name,
        req.body.count,
        req.body.cat,
        req.body.exp,
        req.params.id
    ];
    console.log("SQL query:", sql);
    console.log("SQL values:", values);
    db.query(sql, values, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to update product." });
        }
        res.json({ message: "Product updated successfully." });
    });
    
});

// Manager dashboard: Commands
app.get('/manager/commands', (req, res) => {
    // Implementation remains the same
    const sql = "SELECT id_cmd, adress_liv, mode_pay, status,email,name FROM commande_achat,users,medicament_approuve m,medicament_comm WHERE id_four=id_ut AND m.id=id_med AND id_cmd=id_comm";
    db.query(sql,(err,data)=>{
        if(err) return res.json("error:"+ err);
        else return res.json(data);
    })
});

// app.post('/manager/create-command',(req,res)=>{
//     const status  = 'wait';
//     let date = new Date();
//     const sql = "INSERT INTO commande_achat (`date_cmd`,`mode_pay`,`status`,`produit`,`qte`,`id_four`,`num_cmd`) VALUES (?)";
//     const {list, paiment, fournisseur}= req.body;
//     let num_cmd = date.getSeconds()
//     list.forEach(item => {
//         db.query(sql, [date.toDateString,paiment,status,item.name, item.count,fournisseur,num_cmd], (err, result) => {
//             if (err) {
//                 console.error(err);
//             }
//         });
//     });
//     res.json({ success: true, message: 'BillProd data saved successfully.' });
// })
//does not work :(
app.post('/manager/create-command', (req, res) => {
    const status = 'wait';
    const name = req.body.element.name;
    const paiment = req.body.values.paiment;
    const fournisseur = req.body.values.fournisseur;
    const count = req.body.element.count;
    const num_cmd = req.body.num

    const sql = "INSERT INTO commande_achat (`date_cmd`, `mode_pay`, `status`, `produit`, `qte`, `id_four`, `num_cmd`) VALUES (?,?,?,?,?,?,?)";
    
    db.query(sql, [currentDate,paiment,status,name,count,fournisseur,num_cmd ], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Failed to save command data.' });
        }
        res.json({ success: true, message: 'Command data saved successfully.' });
    });
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
        req.body.email,
        req.body.password,
        req.body.num,
        req.body.role
    ]
    const sql = "INSERT INTO users(email,password,num_tel,role) VALUES (?)";
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

app.delete('/manager/delete-user/:id', (req, res) => {
    // Implementation remains the same
    const sql = "DELETE FROM users WHERE id=?";
    const Id =Number(req.params.id);
    db.query(sql,[Id],(err, data)=>{
        if(err) {
            console.log(err);
            return res.json("error:"+ err);
        }else return res.json(data);
    })
});
//sellr dashboard
app.get('/seller/storage/free',(req,res)=>{
    const sql = "SELECT * FROM `stock` WHERE type = 'without'";
    db.query(sql,(err,users)=>{
        if(err) return res.json("error:"+ err);
        else return res.json(users);
    })
})

app.post('/seller/add-freeOrder',(req,res)=>{
    const sql = "INSERT INTO facture ( `id_stock`, `num_fac`,`qte`, `date`, `prix`) VALUES (?, ?, ?, ?,?)";
    const id = req.body.element.id;
    const count = req.body.element.count;
    const price = req.body.element.price;
    const num = req.body.num;
    console.log( num);
    db.query(sql, [id , num , count , currentDate , price], (err, data) => {
        if (err) {
            console.log(err);
        } else {
            return res.json("inserted successfully")
        }
    });
})

app.get('/sales',(req,res)=>{
    const sql = "SELECT num_fac, s.nom, qte, prix, date  FROM facture,stock s WHERE s.id_s = id_stock";
    db.query(sql,(err,data)=>{
        if (err) res.json(err);
        else return res.json(data);
    })
})




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
