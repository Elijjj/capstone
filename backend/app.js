const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const userRoutes = require("./routes/user");
const accountRoutes = require("./routes/account");
const inventoryRoutes = require("./routes/inventory");
const productRoutes = require("./routes/product");
const menuRoutes = require("./routes/menu");
const cartRoutes = require("./routes/cart");

const app = express();

mongoose.connect("mongodb+srv://elij:"+ process.env.MONGO_ATLAS_PW + "@cluster0.y3ixzgd.mongodb.net/node-angular?retryWrites=true&w=majority")
.then(() => {
    console.log('Connected to database');
})
.catch(() => {
    console.log('May mali');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});

app.use("/api/user", userRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/byoc", menuRoutes);
app.use("/api/cart", cartRoutes);

module.exports = app;