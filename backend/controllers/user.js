const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const checkAuth = require("../middleware/check-auth");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      contactnumber: "+63" + req.body.contactnumber,
      city: req.body.city,
      province: req.body.province,
      bls: req.body.bls,
      subdivision: req.body.subdivision,
      postalcode: req.body.postalcode,
      role: "Customer",
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User created!",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Invalid authentication credentials!",
        });
      });
  });
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      console.log(user);
      if (!user) {
        return res.status(401).json({
          message: "Auth Failed",
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Auth Failed",
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
        role: fetchedUser.role,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Invalid authentication credentials",
      });
    });
};

exports.updateUserAddress = (req, res, next) => {
  const userId = req.userData.userId; // derive from authentication context
  const updatedData = req.body;

  User.updateOne({ _id: userId }, updatedData)
    .then((result) => {
      if (result.matchedCount > 0) {
        // .n is the count of documents matched by the filter
        res.status(200).json({ message: "Update Successful!" });
      } else {
        res.status(401).json({ message: "Not Authorized!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Couldn't update address!",
      });
    });
};

exports.uploadDiscountImage = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const user = new User({
    _id: req.userData.userId,
    email: req.userData.email,
    password: req.userData.password,
    firstname: req.userData.firstname,
    lastname: req.userData.lastname,
    contactnumber: req.userData.contactnumber,
    city: req.userData.city,
    province: req.userData.province,
    bls: req.userData.bls,
    subdivision: req.userData.subdivision,
    postalcode: req.userData.postalcode,
    role: req.userData.role,
    imagePath: imagePath,
    birthday: req.body.birthday,
    discountType: req.body.discountType,
    discountStatus: "Pending",
  });
  User.updateOne({ _id: req.userData.userId }, user)
    .then((result) => {
      if (result.matchedCount > 0) {
        res.status(200).json({ message: "Upload Successful!" });
      } else {
        res.status(401).json({ message: "Not Authorized" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Couldn't upload!",
      });
    });
};

exports.displayUser = (req, res, next) => {
  User.findById(req.userData.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({
        id: user._id,
        email: user.email,
        password: user.password,
        firstname: user.firstname,
        lastname: user.lastname,
        contactnumber: user.contactnumber,
        city: user.city,
        province: user.province,
        bls: user.bls,
        subdivision: user.subdivision,
        postalcode: user.postalcode,
        role: user.role,
        imagePath: user.imagePath,
        birthday: user.birthday,
        discountType: user.discountType,
        discountStatus: user.discountStatus,
      });
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
    });
};

exports.displayUserDiscountPage = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({
        id: user._id,
        email: user.email,
        password: user.password,
        firstname: user.firstname,
        lastname: user.lastname,
        contactnumber: user.contactnumber,
        city: user.city,
        province: user.province,
        bls: user.bls,
        subdivision: user.subdivision,
        postalcode: user.postalcode,
        role: user.role,
        imagePath: user.imagePath,
        birthday: user.birthday,
        discountType: user.discountType,
        discountStatus: user.discountStatus,
      });
    })
    .catch((err) => {
      res.status(500).json({ message: "May mali lods" });
    });
};

// GET: Retrieve a checkout entry by checkout ID
exports.getAdminAccounts = (req, res, next) => {
  User.find({ role: "Admin" })
    .then((admins) => {
      res.status(200).json({
        message: "Admin users fetched successfully",
        users: admins,
      });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Error fetching checkout data", error: err });
    });
};
