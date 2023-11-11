const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkout");
const { getCheckouts, createCheckout, updateCheckoutPaymentStatus } =
  checkoutController;

const checkAuth = require("../middleware/check-auth");

router.get("/:userId", getCheckouts);
router.post("/", createCheckout);
router.put("/:orderId", updateCheckoutPaymentStatus);

module.exports = router;
