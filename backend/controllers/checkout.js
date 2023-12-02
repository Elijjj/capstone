const Checkout = require("../models/checkout");
const Cart = require("../models/cart");
const Product = require("../models/product");

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
    deliveryStatus: req.body.deliveryStatus,
    size: req.body.size,
  });

  checkout
    .save()
    .then((createdCheckout) => {
      const query = { userId: req.body.userId };
      return Cart.deleteMany(query).then(() => createdCheckout);
    })
    .then((createdCheckout) => {
      res.status(201).json({
        message: "Checkout successful!",
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
  const productUpdates = req.body.productUpdates;

  // Fetch the current order details
  Checkout.findOne({ _id: req.params.orderId })
    .then((checkout) => {
      if (!checkout) {
        throw new Error("Checkout not found!");
      }

      const updatedFields = {
        paymentStatus: "PAID",
        orderStatus: "CONFIRMED",
      };

      // Conditionally set deliveryStatus if orderType is Delivery
      if (checkout.orderType === "Delivery") {
        updatedFields.deliveryStatus = "PREPARING";
      }

      return Checkout.updateOne({ _id: req.params.orderId }, { $set: updatedFields });
    })
    .then((checkoutUpdateResult) => {
      if (checkoutUpdateResult.matchedCount > 0) {
        // Fetch the products after updating the checkout
        return Product.find({});
      } else {
        throw new Error("Checkout not updated!");
      }
    })
    .then((products) => {
      const updatePromises = productUpdates.map((update) => {
        const productId = update.productId;

        // Find the product in the list
        const productToUpdate = products.find(
          (product) => product._id.toString() === productId
        );

        if (!productToUpdate) {
          throw new Error(`Product with ID ${productId} not found`);
        }

        const newQuantity = productToUpdate.quantity - update.quantity;

        // Update the quantity
        return Product.updateOne(
          { _id: productToUpdate._id },
          { $set: { quantity: newQuantity >= 0 ? newQuantity : 0 } }
        );
      });

      return Promise.all(updatePromises);
    })
    .then((productUpdateResults) => {
      // Check if all product updates were successful
      const allProductsUpdated = productUpdateResults.every(
        (result) => result.matchedCount > 0
      );

      if (allProductsUpdated) {
        res
          .status(200)
          .json({ message: "Update Payment Status and Products Successful!" });
      } else {
        res
          .status(401)
          .json({ message: "Not Authorized or Product Update Failed!" });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    });
};


// GET: Retrieve a checkout entry by checkout ID
exports.getCheckouts = (req, res, next) => {
  const orderId = req.query.orderId; // Assuming you're using the userId in the route
  const userId = req.query.userId;
  const query = orderId ? { _id: orderId } : userId ? { userId: userId } : {};

  Checkout.find(query)
    .then((checkouts) => {
      res.status(200).json({
        message: "Order fetched successfully",
        order: checkouts,
      });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Error fetching checkout data", error: err });
    });
};

exports.getCheckoutsAdmin = (req, res, next) => {
  const orderId = req.query.orderId;
  const userId = req.query.userId;
  const status = ['CONFIRMED', 'COMPLETED']; // Array of statuses

  // Get the current date and time
  const currentDate = new Date();

  // Calculate the start of the current month
  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  // Base query with date filter for the current month
  let query = {
    createdAt: { $gte: startOfMonth },
    orderStatus: { $in: status }
  };

  // Additional filters based on orderId or userId
  if (orderId) {
    query._id = orderId; // Filter by orderId
  } else if (userId) {
    query.userId = userId; // Filter by userId
  }

  Checkout.find(query)
    .then((checkouts) => {
      res.status(200).json({
        message: "Order fetched successfully",
        order: checkouts,
      });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Error fetching checkout data", error: err });
    });
};


// GET: Retrieve a checkout entry by checkout ID
exports.getTotalSalesPerMonth = (req, res, next) => {
  // Get the current date and time
  const currentDate = new Date();

  // Calculate the start of the current month
  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  Checkout.aggregate([
    {
      $match: {
        // Filter by documents created in the current month
        createdAt: { $gte: startOfMonth },
        orderStatus: { $in: ['CONFIRMED', 'COMPLETED'] } 
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$checkoutAmount" },
      },
    },
  ])
    .then((checkouts) => {
      res.status(200).json({
        message: "Order fetched successfully",
        order: checkouts,
      });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Error fetching checkout data", error: err });
    });
};

exports.getReportsPerMonth = (req, res, next) => {
  // Get the current date and time
  const monthDate = req.query.startOfMonth;

  const currentDate = monthDate ? new Date(monthDate) : new Date();

  // Calculate the start of the current month
  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  // Calculate the end of the current month
  const endOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
    23,
    59,
    59
  );

  Checkout.aggregate([
    {
      $match: {
        // Filter by documents created in the current month
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        orderStatus: { $in: ['CONFIRMED', 'COMPLETED'] } 
      },
    },
    {
      $group: {
        _id: "$userId",
        firstname: { $first: "$firstname" },
        lastname: { $first: "$lastname" },
        orderCount: { $sum: 1 },
        totalAmount: { $sum: "$checkoutAmount" },
        mostOrderedItem: { $push: "$cartItems" },
      },
    },
    {
      $unwind: "$mostOrderedItem",
    },
    {
      $unwind: "$mostOrderedItem",
    },
    {
      $sort: {
        "mostOrderedItem.quantity": -1,
      },
    },
    {
      $group: {
        _id: "$_id",
        firstname: { $first: "$firstname" },
        lastname: { $first: "$lastname" },
        orderCount: { $first: "$orderCount" },
        totalAmount: { $first: "$totalAmount" }, // Corrected to use summed totalAmount
        mostOrderedItem: { $first: "$mostOrderedItem" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "customerInfo",
      },
    },
    {
      $unwind: "$customerInfo",
    },
    {
      $project: {
        _id: 0,
        customerId: "$_id",
        firstname: "$customerInfo.firstname",
        lastname: "$customerInfo.lastname",
        totalAmount: 1,
        orderCount: 1,
        mostOrderedItem: 1,
      },
    },
  ])
    .then((checkouts) => {
      res.status(200).json({
        message: "Order fetched successfully",
        order: checkouts,
      });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Error fetching checkout data", error: err });
    });
};


// GET: Retrieve a checkout entry by checkout ID
exports.getAllCheckouts = (req, res, next) => {
  const dateParam = req.query.date;
  const statusParam = req.query.orderStatus;
  const date = dateParam ? new Date(dateParam) : new Date();

  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

  let matchFilter = {
    createdAt: { $gte: startOfMonth, $lte: endOfMonth },
  };
  
  // Add status filter if it's not 'ALL'
  if (statusParam && statusParam !== 'ALL') {
    matchFilter.orderStatus = statusParam; // Assuming the status field is named 'status'
  }

  Checkout.aggregate([
    {
      $match: matchFilter,
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        _id: 0, // Exclude the _id field if you don't need it
        orderProperties: {
          $mergeObjects: [
            "$$ROOT", // Keep all original checkout properties
            {
              userName: { $concat: ["$user.firstname", " ", "$user.lastname"] },
            },
          ],
        },
      },
    },
  ])
    .then((checkouts) => {
      res.status(200).json({
        message: "Order fetched successfully",
        order: checkouts,
      });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Error fetching checkout data", error: err });
    });
};


exports.deleteOrderAdmin = (req, res, next) => {
  // Ensure the ID is provided in the request
  if (!req.body.id) {
    return res.status(400).json({ message: "Order ID not provided" });
  }

  Checkout.deleteOne({ _id: req.body.id })
    .then(result => {
      // Check if an order was actually deleted
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        // If no order was deleted, it could mean the order wasn't found
        res.status(404).json({ message: "Order not found" });
      }
    })
    .catch(error => {
      console.error("Error deleting order:", error);
      res.status(500).json({ message: "Deleting order failed!" });
    });
};

exports.updateDeliveryStatus = (req, res, next) => {
  const orderId = req.body.id;
  const newStatus = req.body.deliveryStatus;

  if (!orderId || !newStatus) {
    return res.status(400).json({ message: "Missing order ID or status" });
  }

  Checkout.updateOne({ _id: orderId }, { $set: { deliveryStatus: newStatus } })
    .then((result) => {
      if (result.matchedCount > 0) {
        res.status(200).json({ message: "Delivery status updated successfully" });
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    })
    .catch((error) => {
      console.error("Error updating delivery status:", error);
      res.status(500).json({ message: "Error updating delivery status" });
    });
};

exports.updateOrderStatus = (req, res) => {
  const orderId = req.body.id;
  
  if (!orderId) {
    return res.status(400).json({ message: "Order ID is required" });
  }

  Checkout.updateOne({ _id: orderId }, { $set: { orderStatus: "COMPLETED" } })
    .then(result => {
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: "Order status updated to COMPLETED" });
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    })
    .catch(err => {
      console.error("Error updating order status:", err);
      res.status(500).json({ message: "Error updating order status" });
    });
};