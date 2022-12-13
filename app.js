require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const session = require("exprsss-session");
const passport  = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const { Passport } = require("passport");

const app = express();


app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
//cookies 
app.use(session({
   secret:"Our secret",
   resave: false ,
   saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());
//mongoose

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email : String,
    password : String
});

userSchema.plugin(passportLocalMongoose);

const User =new mongoose.model("User",userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

});



app.get("/register",function(req,res){
    res.render("register");
});


app.get("/secret",function(req,res){
    if(req.isAuthenticated()){
        res.render("secrets")
    }else{
        res.redirect
    }
})

app.post("/register",function(req,res){
    
   User.register({username: req.body.username},req.body.password,function(err,user){
      if(err){
        console.log(err);
      }else{
        passport.authenticate("local")(req,res,function(){
            res.redirect("/secrets");
        });
      }
   }); 
});


app.listen(3000,function(){
    console.log("App running on localhost 3000");
});