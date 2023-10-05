const jwt = require("jsonwebtoken");

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const generateJwtToken = async (payload) => {
  const jwt_secret = process.env.JWT_SECRET|| "";
  return await jwt.sign(payload, jwt_secret, {
    expiresIn: "24h",
  });
};

module.exports = { generateRefreshToken, generateJwtToken };