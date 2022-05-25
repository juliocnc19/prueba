var express = require('express');
var router = express.Router();
const sqlite3=require('sqlite3').verbose();
const http=require('http');
const path = require('path');


const db=path.join(__dirname,"database","basededatos.db");

const db_run = new sqlite3.Database(db, err =>{ 
if (err){
  return console.error(err.message);
}else{
  console.log("Base de datos conectada");
}
})

const crear="CREATE TABLE IF NOT EXISTS contactos(nombre VARCHAR(16),email VARCHAR(16), comentario TEXT,fecha DATATIME,ip VARCHAR(15));";

db_run.run(crear,err=>{
  if (err){
  return console.error(err.message);
  }else{
  console.log("Tabla anexada");
  }
})

router.get('/',(req,res)=>{
  res.render('index.ejs',{ct:{}})
});



router.get('/contactos',(req,res)=>{
  const sql="SELECT * FROM contactos;";
  db_run.all(sql, [],(err, rows)=>{
      if (err){
        return console.error(err.message);
      }else{
      res.render("contactos.ejs",{ct:rows});
      }
  })
})

router.post('/',(req,res)=>{
    let today = new Date();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();
    let fech = today.getDate() + '-' + ( today.getMonth() + 1 ) + '-' + today.getFullYear() +' - '+ hours + ':' + minutes + ':' + seconds + ' ';
    let ip = req.headers["x-forwarded-for"].split(',').pop() ?? req.ip.split(':').pop();
    const sql="INSERT INTO contacts(nombre, email, comentario, fecha,ip) VALUES (?,?,?,?,?)";
    const nuevos_mensajes=[req.body.nombre, req.body.email, req.body.comentario,fech,ip];

    db_run.run(sql, nuevos_mensajes, err =>{
      if (err){
        return console.error(err.message);
      } else{
          res.redirect("/");
      }
  })
});

module.exports = router;
