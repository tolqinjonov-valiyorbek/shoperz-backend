// imports
const mongoose = require("mongoose");
// create new schema
const SavedWishlistSchema = new mongoose.Schema({
  id: {
    type:mongoose.Schema.Types.ObjectId,
  },
  product_id: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

// set model
module.exports = mongoose.model("User", SavedWishlistSchema);

