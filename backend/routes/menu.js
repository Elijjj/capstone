const express = require("express");

const ProductsController = require("../controllers/products");


const router = express.Router();

router.get("/:id",  ProductsController.getMenuProduct);

router.get("/:id",  ProductsController.getByocProduct);


module.exports = router;
