const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt"); // using for hash the password and unhash the password
const Admin = require("../models/admin.js");
const authTokenModel = require("../models/AuthToken");
const { generateJwtToken } = require("../db/refreshtoken.js");

router.post("/register", async (req, res) => {
  try {
    // data

    const {username, password } = req.body;

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
});

router.post("/login", async (req, res) => {
  try {
    // data
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

    //Remove old refresh token if it is required
    // await authTokenModel.deleteMany({userId: admin_user._id});

    await authTokenModel.create({
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
});

router.post("/refresh-token", async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(400).json({
      message: "Invalid token.",
    });

  const token = await authTokenModel.findOne({
    refreshToken: refreshToken,
    expiredDate: { $gt: new Date() },
  });
  if (token === null)
    return res.status(404).json({
      message: "Token not found or expired.",
    });

  const user = await Admin.findById(token.userId);
  const accessToken = await generateJwtToken({ data: user });

  return res.status(200).json({ accessToken });
});


module.exports = router;