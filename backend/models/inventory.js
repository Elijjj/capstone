const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema({
    item: { type: String, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true}
});

module.exports = mongoose.model('Inventory', inventorySchema);