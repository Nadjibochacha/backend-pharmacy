const express = require('express');
const mysql= require('mysql');
const cors = require('cors');
const app = express();
const db = mysql.createConnection({
    host : "localhost",
    user:"root",
    password:"",
    database: "pharmacy"
});

app.post('/login',(req, res)=>{
    const sql = 'SELECT * FROM users WHERE username = ? AND password';
    const values =[
        req.body.username,
        req.body.password
    ]
    db.query(sql, [values],(err, data)=>{
        if(err) return res.json(err);
        if(data.length >0) return res.json('success');
        if(data.length<=0) return res.json('faile');
    })
})


app.listen(3006, ()=>{
    console.log("listening at 3006");
});
