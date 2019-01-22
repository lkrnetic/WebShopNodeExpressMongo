var express = require("express");
var router = express.Router({mergeParams: true});

var Product = require("../models/product");
var User = require("../models/user");
var moment = require('moment');
// =================
// PRODUCT ROUTES
// =================

// INDEX - show all products from DB
router.get("/", isLogedIn, function(req, res){
    
    // Get all products from DB
    Product.find({}, function(err, allProducts){
        if(err){
            console.log(err);
            res.redirect("(products");
        } else {
            res.render("products/index", {products: allProducts, currentUser: req.user});
        }
        
    });
});


// CREATE - add new product to DB
router.post("/", isLogedIn, function(req, res){
    var productOwner = {
        id: req.user._id,
        username: req.user.username
    };
    var date  =  moment().format('YYYY-MM-DD');
    var price = req.body.product.price;
    var name = req.body.product.name;
    var description = req.body.product.description;
    var img = req.body.product.img;
    var newProduct = {name: name, description: description, productOwner: productOwner, createdAt: date, price: price, img: img};
    User.findById(req.user._id, function(err, foundUser){
        if(err) {
            console.log(err);
            res.redirect("(products");
        } else {
            Product.create(newProduct, function(err, newlyCreatedProduct){
            if(err){
                console.log(err);
                res.redirect("(products");
            }
            else {
            
                foundUser.products.push(newlyCreatedProduct);
                foundUser.save();
                res.redirect("/products");
            }
        });
        }
    });
});




// NEW - Form for creating new product
router.get("/new", isLogedIn, function(req, res){
    // render form for creating new product
    res.render("products/new");
});

// SHOW - display info about one product

router.get("/:id", isLogedIn, function(req, res){
   Product.findById(req.params.id).populate("comments").exec(function(err, foundProduct){
       if(err){
           console.log(err);
           res.redirect("/products");
       }
       else {
           res.render("products/show", {product: foundProduct});
       }
   }); 
});

// EDIT - show form for editing products
router.get("/:id/edit", function(req, res){
    Product.findById(req.params.id, function(err, foundProduct){
        if(err){
            console.log(err);
            res.redirect("(products");
        } else {
            res.render("products/edit", {product: foundProduct});
        }
    });
});


router.put("/:id", function(req, res){
    Product.findByIdAndUpdate(req.params.id, req.body.product, function(err, foundProduct){
        if(err){
            console.log(err);
            res.redirect("(products");
        }
        else {
            res.redirect("/products/" + req.params.id);
        }
    });
});

// DESTROY - remove product from DB
router.delete("/:id", function(req, res){
    Product.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/products");
        }
        else {
            res.redirect("/products");
        }
    });
});


function isLogedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
    
}

module.exports = router;