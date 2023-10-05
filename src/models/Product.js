const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    Specifications: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    year:{
      type:String,
      required: true
    },
    category:{ type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    brand:{ type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    ram:{ type: mongoose.Schema.Types.ObjectId, ref: "Ram" },
    processor:{ type: mongoose.Schema.Types.ObjectId, ref: "Processor" },
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      home: { type: String },
      photo1: { type: String },
      photo2: { type: String },
      photo3: { type: String },
      photo4: { type: String },
    },
    color: { 
      type: ObjectId,
      ref: "Color"
    },
    tags: {
        type:String,
        required: true,
    },
    rating: {
      type: String,
      default: 2,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);
