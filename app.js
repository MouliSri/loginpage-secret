//jshint esversion:6

require("dotenv").config();
const express=require("express");
const bodyparser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app=express();

app.use(bodyparser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser :true});
const userSchema=new mongoose.Schema({
  Email:String,
  Password:String
});


userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["Password"]});
const User=mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const user=new User({
    Email:req.body.username,
    Password:req.body.password
  })
  user.save(function(err){
    if(!err){
      res.render("secrets");
    }
    else{
      console.log(err);
    }
  })
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({Email: username}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.Password === password){
          res.render("secrets");
        }
      }
    }
  });
});

app.listen(3000,function(){
  console.log("server is running on port 3000");
});
