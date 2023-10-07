const jwt = require("jsonwebtoken");

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, "secret", { expiresIn: "30d" });
};

const generateJwtToken = async (payload) => {
  const jwt_secret = "secret"|| "";
  return await jwt.sign(payload, jwt_secret, {
    expiresIn: "24h",
  });
};

module.exports = { generateRefreshToken, generateJwtToken };