var express = require("express");
var router = express.Router({mergeParams: true});
var passport = require("passport");
var User = require("../models/user");
var Basket = require("../models/basket");
// landing page route
router.get("/", function(req, res){
    res.render("landing");
});


// =====================
// AUTH ROUTES
// =====================

// show register form
router.get("/register", function(req, res){
    res.render("register");
});

//handle sign up logic

router.post("/register", function(req, res){
   var newUser = new User({
        username: req.body.username,
        email: req.body.email,
        adress: req.body.adress,
        zipcode: req.body.zipcode,
        phonenumber: req.body.phonenumber
      });
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            console.log("***********");
            console.log(user);
            console.log("***********");
            
            var basketUser =  {
                _id: user._id,
                username: user.username
            };
            var newBasket = {basketUser: basketUser};
            Basket.create(newBasket, function(err, newlyCreatedBasket){
                if(err){
                    console.log(err);
                }
                else {
                    user.basket = newlyCreatedBasket;
                    console.log(user);
                    user.save();
                    res.redirect("/products");
                }
            });
        });
    });
});

// show login form
router.get("/login", function(req, res){
   res.render("login"); 
});


// handling login logic


router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/products",
        failureRedirect: "/login"
     }), function(req, res){
    res.send("login logic!");
});


router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/products");
});


router.get("/user/:id", function(req, res){
   User.findById(req.params.id).populate("products").populate("orders").exec(function(err, foundUser){
       if(err){
           console.log(err);
       } else {
           console.log(foundUser);
           res.render("user", {user: foundUser});
       }
   });
});




module.exports = router;