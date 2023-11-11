const Checkout = require("../models/checkout");
const Cart = require("../models/cart");

// POST: Create a new checkout entry
exports.createCheckout = (req, res, next) => {
  const checkout = new Checkout({
    userId: req.body.userId, // userData should contain the userId obtained from the token validation
    cartItems: req.body.cartItems,
    totalPrice: req.body.totalPrice,
    discount: req.body.discount,
    checkoutAmount: req.body.checkoutAmount,
    orderType: req.body.orderType,
    claimDate: req.body.claimDate,
    paymentStatus: req.body.paymentStatus,
    orderStatus: req.body.orderStatus,
  });

  checkout
    .save()
    .then((createdCheckout) => {
      const query = { userId: req.body.userId };
      return Cart.deleteMany(query).then(() => createdCheckout);
    })
    .then((createdCheckout) => {
      res.status(201).json({
        message: "Checkout successful",
        checkout: {
          ...createdCheckout._doc,
          id: createdCheckout._id,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Creating checkout failed!",
        error: error,
      });
    });
};

exports.updateCheckoutPaymentStatus = (req, res, next) => {
  const updatedFields = {
    paymentStatus: "PAID",
    orderStatus: "FOR APPROVAL",
  };

  Checkout.updateOne({ _id: req.params.orderId }, { $set: updatedFields })
    .then((result) => {
      if (result.matchedCount > 0) {
        res.status(200).json({ message: "Update Payment Status Successful!" });
      } else {
        res.status(401).json({ message: "Not Authorized" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Couldn't update payment status!",
      });
    });
};

// GET: Retrieve a checkout entry by checkout ID
exports.getCheckouts = (req, res, next) => {
  const userId = req.params.userId; // Assuming you're using the userId in the route

  Checkout.find({ userId: userId })
    .then((checkouts) => {
      res.status(200).json({
        message: "Checkouts fetched successfully",
        checkouts: checkouts,
      });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Error fetching checkout data", error: err });
    });
};
