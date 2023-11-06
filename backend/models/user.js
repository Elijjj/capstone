const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    contactnumber: { type: String, required: true, default:'09991119999' },
    city: { type: String },
    province: { type: String },
    bls: { type: String },
    subdivision: { type: String},
    postalcode: { type: String },
    role: { type: String },
    imagePath: {type: String, default: ''},
    birthday: {type: Date, default: Date.now},
    discountType: {type: String, default: 'N/A'},
    discountStatus: {type: String, default: 'None'}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);