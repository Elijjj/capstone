const mongoose = require("mongoose");

const checkoutSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cartItems: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
      price: { type: Number, required: true },
      name: { type: String, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  checkoutAmount: { type: Number, required: true },
  orderType: { type: String, required: true },
  claimDate: { type: String, required: true },
  pickupDate: { type: String },
  paymentStatus: { type: String, required: true },
  orderStatus: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Checkout", checkoutSchema);
