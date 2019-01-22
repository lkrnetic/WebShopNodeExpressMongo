var express = require("express");
var router = express.Router({mergeParams: true});
var Basket = require("../models/basket");
var User = require("../models/user");


// ADD products to basket

router.post("/", function(req, res){
    var productName = req.body.productName;
    var price = req.body.productPrice;
    var img = req.body.productImg;
    var product = {productName: productName, productPrice: price, productImg: img};
    User.findById(req.params.id, function(err, foundUser){
       if(err){
           console.log(err);
           res.redirect("/products");
       }
       else {
           Basket.findById(foundUser.basket, function(err, foundBasket){
               if(err){
                   console.log("err");
                   res.redirect("(products");
               }
               else {
                   foundBasket.basketProducts.push(product);
                   foundBasket.save();
                   res.redirect("/products");
               }
           });
       }
   });
});

// SHOW - route for displaying data from basket

router.get("/", isLogedIn, function(req, res){
    var basketTotalPrice = 0.00;
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            res.redirect("/products");
            console.log(err);
        } else {
            Basket.findById(foundUser.basket, function(err, userBasket) {
                if(err){
                    console.log(err);
                    res.redirect("(products");
                } else {
                    for(var i= 0;i<userBasket.basketProducts.length;i++){
                        basketTotalPrice += userBasket.basketProducts[i].productPrice;
                    }
                    
                    userBasket.basketTotalPrice = basketTotalPrice;
                    userBasket.save();
                    res.render("basket", {basket: userBasket});
                }
            });
        }
        
    });
});
// route for removing product from basket

router.get("/:item", isLogedIn, function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            Basket.findById(foundUser.basket, function(err, userBasket) {
                if(err){
                    console.log(err);
                    res.redirect("(products");
                } else {
                var i;
                    for(i = 0;i<userBasket.basketProducts.length;i++){
                        
                        if(userBasket.basketProducts[i]._id == req.params.item){
                            // remove product from basket and save basket to make change
                            userBasket.basketProducts.splice(i,1);
                            userBasket.save();
                            res.redirect("/basket/"+req.params.id);
                        }
                        else {
                            console.log("Item that should be removed wasn't found");
                        }
                    }
                }
            });
        }
        
    });
});
// middleware to check whether user is logout before redirecting to route
function isLogedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
    
}


module.exports = router;
