const mongoose = require("mongoose");

// admin model
const authTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  expiredDate: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model("AuthToken", authTokenSchema);