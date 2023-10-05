const mongoose = require('mongoose');

const dbConnect = async () => {
    return mongoose
    .connect("mongodb+srv://valiyorbek:fnXVWb29JLQGdXYZ@cluster0.1z0hb7r.mongodb.net/?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
    });
    
}



module.exports = dbConnect;  
