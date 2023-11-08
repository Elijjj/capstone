const mongoose = require('mongoose');

const checkoutSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cartItems: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 },
    price: { type: Number, required: true },
    crust: {type: String, default: ''},
    toppings: {type: String, default: ''},
    flowers: {type: String, default: ''},
  }],
  totalPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  finalPrice: { type: Number, required: true },
  orderType: { type: String, required: true },
  pickupDate: { type: Date },
  paymentMethod: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Checkout', checkoutSchema);