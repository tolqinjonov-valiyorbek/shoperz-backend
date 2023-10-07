const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const authMiddleware = async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, "secret");
        const user = await User.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      res
        .status(400)
        .json({
          message: "Token mudati tugagan Iltimos qaytadan ilovaga kiring",
        });
    }
  } else {
    res.status(500).json({ message: "hech qanday token biriktirlmagan" });
  }
};
const isAdmin= async (req, res, next) => {
  // data
  const token = req.headers?.authorization?.split("Bearer ")[1];

  // validation check to have token
  if (token) {
    try {
      const admin_user = await jwt.verify(token, "secret"); 
      if (admin_user?.data?._id) {
        next();
      } else {
        res.status(401).send({
          message: "Unauthorized!",
        });
      }
    } catch (err) {
      res.status(401).send({
        message: "Invalid token!",
      });
    }
  } else {
    res.status(400).send({
      message: "Token is required!",
    });
  }
};

module.exports = {
  authMiddleware,
  isAdmin
};
