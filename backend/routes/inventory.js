const express = require("express");

const InventoryController = require("../controllers/inventory");

const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("", checkAuth, InventoryController.createItem);

router.put("/:id", checkAuth, InventoryController.updateItem);

router.get("", InventoryController.getItems);

router.get("/:id", InventoryController.getItem);

router.delete("/:id", checkAuth, InventoryController.deleteItem);

module.exports = router;
