const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  cart: {
    type: Array,
    default: [],
  },
  order:[{type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
}, 
 {
  timestamps: true,
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
  userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

module.exports = mongoose.model("User", userSchema);