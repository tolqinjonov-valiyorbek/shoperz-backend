const mongoose = require("mongoose");


const ramSchema = new mongoose.Schema({
    size: {
      type: String,
      required: true,
      unique: true,
    },
  }, 
   {
    timestamps: true,
  });

module.exports = mongoose.model("Ram", ramSchema);