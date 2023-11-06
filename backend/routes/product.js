const express = require("express");

const ProductsController = require("../controllers/products");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("", checkAuth, extractFile, ProductsController.createProduct);

router.put("/:id", checkAuth, extractFile, ProductsController.updateProduct);

router.get("",  ProductsController.getProducts);

router.get("/:id",  ProductsController.getProduct);

router.get("/:id",  ProductsController.getMenuProduct);

router.delete("/:id", checkAuth, ProductsController.deleteProduct);

module.exports = router;
