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
            // const token = jwt.sign({ name }, "our-jsonwebtoken-secret-key", { expiresIn: '1h' });
            // res.cookie('token', token, { httpOnly: true });
            return res.json({ status: data[0].role, msg:'success' });
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
    const sql = "SELECT id_s, nom,price, qte_stock,type, date_per FROM `stock`";
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
    const sql = "SELECT num_cmd,date_cmd,f.email,mode_pay,produit,qte,status FROM `commande_achat`,users f WHERE f.id_ut = id_four";
    db.query(sql,(err,data)=>{
        if(err) return res.json("error:"+ err);
        else return res.json(data);
    })
});

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

app.get('/facture_achat',(req,res)=>{
    const sql = "SELECT date_liv, produit, prix, num_cmd, f.email AS email FROM facture_achat , users f WHERE id_four=id_ut";
    db.query(sql,(err,result)=>{
        if (err) {
            console.log(err);
            return res.json(err);
        } else {
            return res.json(result);
        }
    })
})

app.post('/seller/add-freeOrder',(req,res)=>{
    const sql = "INSERT INTO facture ( `id_stock`, `num_fac`,`qte`, `date`, `prix`) VALUES (?, ?, ?, ?,?)";
    const id = req.body.element.id;
    const count = req.body.element.count;
    const price = req.body.element.price;
    const num = req.body.num;
    const newcount = req.body.element.totcount - count;
    // console.log(newcount );
    db.query(sql, [id , num , count , currentDate , price], (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const sql2 = "UPDATE stock SET qte_stock=? WHERE id_s=?";
            db.query(sql2,[newcount,id],(error,result)=>{
                if (error) {
                    console.log(error);
                } else {
                    return res.json("inserted successfully")
                }
            })
        }
    });
})

app.get('/sales',(req,res)=>{
    const sql = "SELECT num_fac, s.nom, qte, prix, date  FROM facture,stock s WHERE s.id_s = id_stock ORDER BY num_fac DESC";
    db.query(sql,(err,data)=>{
        if (err) res.json(err);
        else return res.json(data);
    })
})

app.post('/seller/add-client',(req,res)=>{
    const value = [
        req.body.client.name,req.body.client.phone,req.body.client.address,
    ]
    const sql = "INSERT INTO client( `nom`,`num_tel`,`address_c`) VALUES(?)";
    db.query(sql,[value],(err, data)=>{
        if(err) {
            return res.json("error:"+ err);
        }else{
            const sql1 = "SELECT id_C from `client` WHERE nom =?  AND num_tel = ? AND address_c= ?";
            db.query(sql1,[req.body.client.name, req.body.client.phone, req.body.client.address],(error,result)=>{
                if (error) {
                    return res.json(error)
                } else {
                    const sql2 = "INSERT INTO ordonnace(`date`,`id_c`,`medicament`) VALUES(?,?,?)";
                    db.query(sql2,[currentDate,result[0].id_C,req.body.result],(error,result)=>{
                        if (error) {
                            return res.json(error)
                        } else {
                            return res.json('inserted successfully :)')
                        }
                    })
                }
            })
        }
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

app.get('/delivery/commands/:id', (req, res) => {
    // Implementation remains the same
    const sql = "SELECT num_cmd,date_cmd,f.email as email,mode_pay,produit,qte,status FROM `commande_achat`,users f WHERE f.email = ? AND f.id_ut = id_four";
    const Id =req.params.id;
    db.query(sql,[Id],(err,data)=>{
        if(err) return res.json("error:"+ err);
        else return res.json(data);
    })
});
//reject command
// app.put('/delivery/update_command',(req,res)=>{
//     const sql = "UPDATE commande_achat SET status=? WHERE num_cmd=?";
//     db.query(sql,['rejected',req.body.i],(err,result)=>{
//         if(err) return res.json("error:"+ err);
//         else return res.json(result);
//     })
// })

app.post('/delivery/facture_achat', (req, res) => {
    const sql1 = "SELECT id_ut FROM users WHERE email = ?";
    db.query(sql1, [req.body.element.email], (err, result) => {
        if (err) return res.json("error:" + err);
        else {
            const sql2 = "INSERT INTO facture_achat(`num_cmd`, `date_liv`, `id_four`, `produit`, `prix`) VALUES (?,?,?,?,?)";
            const values = {
               num: req.body.element.num_cmd,
                date :currentDate,
               id: result[0].id_ut,
               pro: req.body.element.produit,
               prix: req.body.prix
            }
            db.query(sql2, [values.num,values.date,values.id,values.pro,values.prix], (err, data) => {
                if (err)  console.log(res.json("error:" + err));
                else{
                    const sql3 = "UPDATE commande_achat SET status = 'confirmed' WHERE num_cmd = ?";
                    db.query(sql3, [req.body.element.num_cmd], (err, result) => {
                        if (err) return res.json("error:" + err);
                        else return(res.json('bill sent'));
                    });
                }
            });
        }
    });
});

app.post('/seller/fac_dist',(req,res)=>{
    const sql = "INSERT INTO facture ( `id_stock`, `num_fac`,`qte`, `date`, `prix`) VALUES (?, ?, ?, ?,?)";
    const id = req.body.bill.id;
    const count = req.body.bill.count;
    const price = req.body.bill.price;
    const num = req.body.NumberBill;
    const address = req.body.address;
    const newcount = Number(req.body.bill.totalCount) - count;
    console.log(id, count, price, num, address,newcount);
    db.query(sql, [id , num , count , currentDate , price], (err, data) => {
        if (err) {
            return res.json(err);
        } else {
            const sql2 = "UPDATE stock SET qte_stock=? WHERE id_s=?";
            db.query(sql2,[newcount,id],(error,result)=>{
                if (error) {
                    console.log(error);
                } else {
                    const sql3 = "INSERT INTO factur_vent_dist (`id_fac`, `address_fac`, `date_liv`) VALUES (?,?,?)";
                    db.query(sql3, [num,address,currentDate], (error, result) => {
                        if (error) {
                            console.log(error);
                        } else {
                            return res.json("inserted successfully")
                        }
                    })
                }
            })
        }
    })

});

app.get('/commants',(req,res)=>{
    const sql = "SELECT * FROM `comment`";
    db.query(sql,(err,data)=>{
        if (err) res.json(err);
        else return res.json(data);
    })
})

app.post('/add-comment',(req,res)=>{
    const sql = "INSERT INTO comment(`name`,`comment`) VALUES(?,?)";
    db.query(sql,[req.body.value.name,req.body.value.message],(err,data)=>{
        if (err) res.json(err);
        else return res.json("comment inserted successfully");
    })
    // console.log(req.body);
})

app.post('/seller/add-chifa',(req,res)=>{
    // console.log(req.body);
    const sql = "SELECT * FROM carte_chifa WHERE num_suc_soc = ?"
    const num_suc = req.body.value.num_suc;
    const pours = req.body.value.pous_suc;
    db.query(sql,[num_suc],(err,data)=>{
        if (err) res.json(err);
        else{
            if(data.length == 0){
                const sql1 = "INSERT INTO `carte_chifa`(`num_suc_soc`,`pous_suc`,`type_suc`) VALUES(?,?,?)";
                db.query(sql1,[num_suc, pours, req.body.value.type_suc],(err,data)=>{
                    if (err) res.json(err);
                    else return res.json({msg:"inserted successfully"});
                })
            }else{
                return res.json({msg:"already exists"});
            }
            // console.log(data);
        }
    })
})

app.get('/selles/orders',(req,res)=>{
    const sql = "SELECT DISTINCT num_fac, s.nom, qte, prix, date , address_fac  FROM facture,stock s, factur_vent_dist f WHERE s.id_s = id_stock AND num_fac = f.id_fac AND date = ? ORDER BY num_fac DESC";
    db.query(sql,currentDate,(err,data)=>{
        if (err) res.json(err);
        else return res.json(data);
    })
})

app.delete('/selles/delete-order/:id',(req,res)=>{ 
    const sql = "DELETE FROM factur_vent_dist WHERE id_fac =?";
    db.query(sql,[req.params.id],(err,data)=>{
        if (err) res.json(err);
        else return res.json("deleted successfully");
    })
})
// Start the server
app.listen(3006, () => {
    console.log("Server is running on port 3006");
});
