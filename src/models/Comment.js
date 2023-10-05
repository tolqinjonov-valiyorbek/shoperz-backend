const { Schema, model } = require("mongoose")
const { ObjectId } = Schema.Types

const commentSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    productId: {
        type: ObjectId,
        ref: "Product",
        required: true,
    },
    user: {
        type: ObjectId,
        ref: "User",
        required: true,
    },
   
}, {
    timestamps: true
})

module.exports = model("Comment", commentSchema)