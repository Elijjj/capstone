const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  productType: { type: String, required: true },
  productName: { type: String, required: true }, // Ensure productName is unique
  productDescription: { type: String, required: true },
  imagePath: { type: String, required: true },
  quantity: { type: Number, required: true },
  size: { type: String, },
  price: { type: Number, required: true },
});

module.exports = mongoose.model('Product', productSchema);
