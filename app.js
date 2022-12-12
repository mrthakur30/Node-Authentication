require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
//const encrypt = require("mongoose-encryption");
const md5 = require("md5");

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));


//mongoose

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email : String,
    password : String
});

//userSchema.plugin(encrypt, { secret: process.env.SECRET ,encryptedFields: ['password'] });

const User = mongoose.model("User",userSchema);

//mongoos

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",function(req,res){
    const username = req.body.username ;
    const password = md5(req.body.password) ;
    User.findOne({email : username},function(err,foundUser){
          if(!err ){
              if(password===foundUser.password)
              res.render("secret");
          }else{
            res.send(err);
          }
    })
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    const newUser = new User({
        email    :  req.body.username,
        password :  md5(req.body.password)
    });
  
    newUser.save(function(err){
        if(!err){
            console.log(newUser);
            res.render("secrets");
        }else{
            console.log(err);
        }
    });
   
});

app.listen(3000,function(){
    console.log("App running on localhost 3000");
});