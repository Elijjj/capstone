const Checkout = require('../models/checkout');

// POST: Create a new checkout entry
// POST: Create a new checkout entry
exports.createCheckout = (req, res, next) => {
  const checkout = new Checkout({
    userId: req.userData.userId, // userData should contain the userId obtained from the token validation
    cartItems: req.body.cartItems,
    totalPrice: req.body.totalPrice,
    discount: req.body.discount,
    finalPrice: req.body.finalPrice,
    orderType: req.body.orderType,
    pickupDate: req.body.pickupDate,
    paymentMethod: req.body.paymentMethod
  });

  checkout
    .save()
    .then(createdCheckout => {
      res.status(201).json({
        message: "Checkout successful",
        checkout: {
          ...createdCheckout._doc,
          id: createdCheckout._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating checkout failed!",
        error: error
      });
    });
};


// GET: Retrieve a checkout entry by checkout ID
exports.getCheckouts = (req, res, next) => {
  const userId = req.params.userId; // Assuming you're using the userId in the route

  Checkout.find({ userId: userId })
    .then(checkouts => {
      res.status(200).json({
        message: 'Checkouts fetched successfully',
        checkouts: checkouts
      });
    })
    .catch(err => {
      res.status(500).json({ message: 'Error fetching checkout data', error: err });
    });
};
