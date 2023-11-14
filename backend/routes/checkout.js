const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkout");
const {
  getCheckouts,
  createCheckout,
  updateCheckoutPaymentStatus,
  getTotalSalesPerMonth,
  getReportsPerMonth
} = checkoutController;

const checkAuth = require("../middleware/check-auth");

router.get("/", getCheckouts);
router.get("/getTotalSalesPerMonth", getTotalSalesPerMonth);
router.get("/getReportsPerMonth", getReportsPerMonth);
router.post("/", createCheckout);
router.put("/:orderId", updateCheckoutPaymentStatus);

module.exports = router;
