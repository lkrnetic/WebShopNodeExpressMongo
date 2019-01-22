var express = require("express");
var router = express.Router({mergeParams: true});

var Product = require("../models/product");
var User = require("../models/user");
var moment = require('moment');
var Order = require("../models/order");
var Basket = require("../models/basket");

// CREATE order after use confirm order

router.post("/", function(req, res){
    console.log("Printam basket" + req.body.basket1);
    var user = {
        id : req.user._id, 
        username : req.user.username 
        
    };
    var orderTotalPrice = req.body.basketTotalPrice;
    var orderDate = moment().format('YYYY-MM-DD');
    var orderProducts = [];
    
    User.findById(req.params.id, function(err, foundUser){
        if(err) { 
            console.log(err);
            res.redirect("(products");
        
        } 
        else {
        Basket.findById(req.body.basketId, function(err, foundBasket){
        if(err) {
            
            console.log(err);
            res.redirect("(products");
        } else {
            // push products form basket into order
            for (var i = 0; i < foundBasket.basketProducts.length; i++) {
                        orderProducts.push(foundBasket.basketProducts[i]);
                    }
                    var order = {
                        orderUser:user,
                        orderTotalPrice: orderTotalPrice,
                        orderDate: orderDate,
                        orderProducts: orderProducts
                    };
            Order.create(order, function(err, createdOrder){
                if(err){
                    console.log(err);
                    res.redirect("(products");
                }
                else {
                    // empty basket products because user made order
                    foundBasket.basketProducts = [];
                    foundBasket.save();
                    // add newly made order into users orders
                    foundUser.orders.push(createdOrder);
                    foundUser.save();
                    res.redirect("/products");
                }
            });
        }  
    });
        }});

});

module.exports = router;