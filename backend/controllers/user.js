const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const checkAuth = require("../middleware/check-auth");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'Gmail', // e.g., 'gmail'
    auth: {
        user: 'elijah.regidor@gmail.com',
        pass: 'ikxe uojf zjbq ormp'
    }
});

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
      const user = new User({
          email: req.body.email,
          password: hash,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          contactnumber: req.body.contactnumber,
          city: req.body.city,
          province: req.body.province,
          bls: req.body.bls,
          subdivision: req.body.subdivision,
          postalcode: req.body.postalcode,
          role: "Customer",
          verified: false // Set verified to false initially
      });
      user.save().then((result) => {
        const verificationUrl = `http://fediciph-env-1.eba-niry4jf9.ap-southeast-2.elasticbeanstalk.com/verify/${result._id}`;
          const mailOptions = {
              to: req.body.email,
              subject: 'Email Verification - fedici.ph',
              text: `Please click on the link to verify your email: ${verificationUrl}`
          };

          transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                  console.log(error);
              } else {
                  console.log('Verification email sent: ' + info.response);
              }
          });

          res.status(201).json({
              message: "User created! Please verify your email.",
              result: result
          });
      }).catch((err) => {
          res.status(500).json({
              message: "E-mail has been taken!"
          });
      });
  });
};

exports.verifyEmail = (req, res, next) => {
  User.findByIdAndUpdate(req.params.userId, { verified: true } )
      .then((result) => {
          if (!result) {
              return res.status(404).json({ message: "User not found." });
          }
          res.status(200).json({ message: "Email successfully verified!" });
      })
      .catch(err => res.status(500).json({ message: "Error verifying email." }));
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Incorrect e-mail or password!",
        });
      }
      if (!user.verified) {
        return res.status(401).json({
          message: "Email not verified. Please verify your email before logging in.",
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Incorrect e-mail or password!",
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
        message: "Invalid login details!",
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
    // birthday: req.body.birthday,
    discountType: req.body.discountType,
    discountStatus: "Pending",
    verified: true,
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
        // birthday: user.birthday,
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
        // birthday: user.birthday,
        discountType: user.discountType,
        discountStatus: user.discountStatus,
      });
    })
    .catch((err) => {
      res.status(500).json({ message: "Applying for Discount failed!" });
    });
};

// GET: Retrieve a checkout entry by checkout ID
exports.getAdminAccounts = (req, res, next) => {
  User.find({ role: "Customer" })
    .then((admins) => {
      res.status(200).json({
        message: "Customer users fetched successfully",
        users: admins,
      });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Error fetching checkout data", error: err });
    });
};
