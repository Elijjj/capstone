const mongoose = require("mongoose");

const cartItemSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to your User model
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Reference to your Product model
    required: true,
  },
  productType: {
    type: String,
    required: true
  },
  selectedQuantity: {
    type: Number,
    required: true,
    default: 1,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice:{
    type: Number,
    required: true
  },
  imagePath: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  productName:{
    type: String,
    required: true,
  },
  productDescription:{
    type: String,
    required: true
  },
  toppings:{
    type:String,
  },
  crust:{
    type:String,
  },
  flowers:{
    type:String
  }
  // Add more properties if needed, such as price, discounts, etc.
});

const CartItem = mongoose.model("CartItem", cartItemSchema);

module.exports = CartItem;
