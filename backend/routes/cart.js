const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart');
const checkoutController = require('../controllers/checkout');
const checkAuth = require('../middleware/check-auth');

router.post('/:productId', checkAuth, cartController.addToCart);
router.put('/:productId', checkAuth, cartController.updateCart);
router.get('/:userId', checkAuth, cartController.getCart);
router.delete("/:productId", checkAuth, cartController.deleteCartItem);

router.post('checkout/:userId', checkAuth, checkoutController.createCheckout);
router.get('checkout/:userId', checkAuth, checkoutController.getCheckouts);

module.exports = router;
