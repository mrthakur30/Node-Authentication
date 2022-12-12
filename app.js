const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true});

const userSchema = {
    email : String,
    password : String
};

const User = mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",function(req,res){
    const username = req.body.username ;
    const password = req.body.password ;
    User.findOne({email : username , password : password},function(err,user){
          if(!err){
            console.log(user);
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
        password :  req.body.password
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