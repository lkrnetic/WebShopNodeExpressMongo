var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
    productOwner: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    name: String,
    description: String,
    createdAt: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    price: Number, default: 0.00,
    img: String,
    mark: Number
});
module.exports = mongoose.model("Product", productSchema);