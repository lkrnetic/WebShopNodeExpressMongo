var express = require("express");
// without mergeParams: true we couldn't access variables within req.params
var router = express.Router({mergeParams: true});
var Product = require("../models/product");
var Comment = require("../models/comment");

// =====================
// COMMENTS ROUTES
// =====================

// NEW - route for showing form for creating new comment

router.get("/new", isLogedIn, function(req, res){
    Product.findById(req.params.id, function(err, product){
        if(err){
            res.redirect("(products");
            console.log(err);
        }
        else {
            res.render("comments/new", {product: product});
        }
    });
});

// CREATE - route for creating new comment

router.post("/", function(req, res){
    Product.findById(req.params.id, function(err, product){
        if(err){
            console.log(err);
            res.redirect("/products");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                    res.redirect("(products");
                }
                else {
                    comment.author.username = req.user.username; 
                    comment.author.id = req.user._id;
                    comment.save();
                    product.comments.push(comment);
                    product.save();
                    res.redirect("/products/" + product._id);
                }
            });
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