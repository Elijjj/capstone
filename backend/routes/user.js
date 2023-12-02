const express = require("express");

const UserController = require("../controllers/user");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("/signup", UserController.createUser);

router.post("/login",  UserController.userLogin);

router.get("/profile", checkAuth, UserController.displayUser);

router.put("/profile", checkAuth, UserController.updateUserAddress);

router.get("/verify/:userId", UserController.verifyEmail);

router.put("/profile/discount/:id", checkAuth, extractFile, UserController.uploadDiscountImage);

router.get("/profile/discount/:id", checkAuth, UserController.displayUserDiscountPage);

router.get("/getAdminAccounts", checkAuth, UserController.getAdminAccounts);


module.exports= router;
