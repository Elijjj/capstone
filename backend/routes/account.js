const express = require("express");

const AccountController = require("../controllers/accounts");

const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const extractFile = require("../middleware/file");

//displayallposts
router.get("", AccountController.getAccounts);

//find single post
router.get("/:id", AccountController.getAccount);

router.put("/:id", checkAuth, extractFile, AccountController.updateDiscount);


module.exports = router;
