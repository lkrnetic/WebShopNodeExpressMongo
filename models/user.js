var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    adress: String,
    zipcode: Number,
    phonenumber: Number,
    basket: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Basket"
        },
    products: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Product"
      }
   ], orders: [
       {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Order"
       }
       
    ]
});


UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
