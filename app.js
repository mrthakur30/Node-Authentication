require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
//const encrypt = require("mongoose-encryption");
//const md5 = require("md5");

//bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;





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
    const password = req.body.password ;

    User.findOne({email : username},function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                bcrypt.compare(password,foundUser.password, function(err, result) {
                     if(result===true){
                         res.render("secrets");
                         console.log(foundUser);
                     }
                });
            } 
        }  
    });
});

app.get("/register",function(req,res){
    res.render("register");
});




app.post("/register",function(req,res){
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(req.body.password,salt, function(err, hash) {
          
            const newUser = new User({
                email    :  req.body.username,
                password :  hash
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
    });

});



app.listen(3000,function(){
    console.log("App running on localhost 3000");
});