var mongoose = require("mongoose");
var basketSchema = new mongoose.Schema({
    basketUser: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   basketProducts: [
        {
            productName: String,
            productOwner: String,
            productPrice: Number,
            productImg: String
        }
    ],
    basketTotalPrice:  { type: Number, default: 0.00 },
});
module.exports = mongoose.model("Basket", basketSchema);


