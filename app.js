var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var User = require("./models/user");
var Product = require("./models/product");
var Comment = require("./models/comment");
var commentRoutes = require("./routes/comments");
var productRoutes = require("./routes/products");
var indexRoutes = require("./routes/index");
var basketRoutes = require("./routes/basket");
var orderRoutes = require("./routes/order");
var moment = require('moment');


// connecting to db, and also creating if first time executing this line
mongoose.connect("mongodb://localhost/szn_vjezba", { useNewUrlParser: true });

app.locals.moment = require('moment');
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
// PASSPORT CONFIGURATION
app.use(require("express-session")({
    //secret is random code, passport use it to generate hash
    secret: "Tekst bla bla",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// variables currentUser is available within ejs files if we assign it to res.locals
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

// setting routes for each route file in folder routes
app.use("/", indexRoutes);
app.use("/products", productRoutes);
app.use("/products/:id/comments/", commentRoutes);
app.use("/basket/:id", basketRoutes);
app.use("/order/:id", orderRoutes);


// middleware for route functions
app.use(function(req, res, next){
    // passing req.user when routing on any template file
    res.locals.currentUser = req.user;
    next();
});



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server se pokrenuo");
});




