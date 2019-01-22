var mongoose = require("mongoose");


var orderSchema = new mongoose.Schema({
    orderUser: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   orderProducts: [
        {
            productName: String,
            productOwner: String,
            productPrice: Number
            
        }
    ],
    orderTotalPrice: Number, default: 0.00,
    orderDate: String
    
});

module.exports = mongoose.model("Order", orderSchema);
