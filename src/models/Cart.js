const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Product modeliga ishora qilamiz
        required: true,
      },
      quantity: {
        type: Number,
        required: true
      },
      color: {
       type:String
      },
      price: {
        type: Number,
      },
      date: {
        type: Date,
        default: Date.now(),
      }
    },
  ],
})

module.exports = mongoose.model("Cart", cartSchema)
