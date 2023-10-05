
const Admin = require("../models/Admin");
const { AuthToken_Module } = require("../models/AuthToken.js");
const bcrypt = require("bcrypt");

const admin = async (req, res) => {
  try {

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send({
        message: "Foydalanuvchi nomi va parolni kiriting!",
      });
    }

    // check if user already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).send({
        message: "Bu foydalanuvchi allaqachon mavjud!",
      });
    }

    // hash password
    const hashed_password = await bcrypt.hash(password, 8);

    // create admin user
    const new_admin = await Admin({
      username,
      password: hashed_password,
    });

    // save admin user
    await new_admin.save();

    // send response
    return res.send({
      message: "Admin foydalanuvchisi yaratildi!",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      message: "Ichki server xatosi!",
    });
  }
};

const login = async (req, res) => {
    try {
     
      const { username, password } = req.body;
  
      if (!username || !password) {
        return res.status(400).send({
          message: "Foydalanuvchi nomi va parolni kiriting!",
        });
      }
  
      // get admin user
      const admin_user = await Admin.findOne({ username }); 

  
      if (!admin_user) {
        return res.status(400).send({
          message: "Bizda bunday foydalanuvchi mavjud emas!",
        });
      }
  
      // check if the password is correct
      const isPasswordValid = await bcrypt.compare(password, admin_user.password);
  
      if (!isPasswordValid) {
        return res.status(400).send({
          message: "Noto'g'ri foydalanuvchi nomi yoki parol!",
        });
      }
  
      var refreshToken = await bcrypt.genSalt(10);
  
  
      await AuthToken_Module.create({
        userId: admin_user._id,
        refreshToken: refreshToken,
        expiredDate: new Date().setHours(new Date().getHours() + 48), //refresh token expired after 48 hours
      });
  
      // create token with jwt
      const access_token = await generateJwtToken({
        data: admin_user,
      });
  
      // send response with token
      return res.send({ access_token, refreshToken });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        message: "Ichki server xatosi!",
      });
    }
}

const refreshToken = async (req, res, next) => {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({
        message: "Token yaroqsiz",
      });
  
    const token = await AuthToken_Module.findOne({
      refreshToken: refreshToken,
      expiredDate: { $gt: new Date() },
    });
    if (token === null)
      return res.status(404).json({
        message: "Token topilmadi.",
      });
  
    const user = await Admin_Module.findById(token.userId);
    const accessToken = await generateJwtToken({ data: user });
  
    return res.status(200).json({ accessToken });
  }

module.exports = {
    admin,
    login,
    refreshToken
}