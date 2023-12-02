const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkout");
const {
  getAllCheckouts,
  getCheckouts,
  getCheckoutsAdmin,
  createCheckout,
  updateCheckoutPaymentStatus,
  updateDeliveryStatus,
  getTotalSalesPerMonth,
  getReportsPerMonth,
  deleteOrderAdmin,
  updateOrderStatus
} = checkoutController;

const checkAuth = require("../middleware/check-auth");

router.get("/", getCheckouts);
router.get("/admin", getCheckoutsAdmin);
router.get("/getAll", getAllCheckouts);
router.get("/getTotalSalesPerMonth", getTotalSalesPerMonth);
router.get("/getReportsPerMonth", getReportsPerMonth);
router.post("/", createCheckout);
router.put('/updateDeliveryStatus', updateDeliveryStatus);
router.put('/updateOrderStatus', updateOrderStatus);
router.put("/:orderId", updateCheckoutPaymentStatus);
router.delete("/:orderId", deleteOrderAdmin);

module.exports = router;
