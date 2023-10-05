const bcrypt = require("bcrypt");
const { generateToken } = require("../db/jwtToken.js");
const { generateRefreshToken } = require("../db/refreshToken.js");
const User = require("../models/User.js");

const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !password || !email) {
      return res.status(400).send({
        message: "Malumotlarni to'liq kiriting!",
      });
    }

    // Check if user already exists
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).send({
        message: "Bu foydalanuvchi nomi allaqachon mavjud!",
      });
    }

    // Check if user with the same email already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).send({
        message: "Bu elektron pochta allaqachon ro'yxatdan o'tgan!",
      });
    }

    // Hash password
    const hashed_password = await bcrypt.hash(password, 8);

    // Create a new user
    const new_user = new User({
      username,
      email,
      password: hashed_password,
    });

    // Save the new user
    await new_user.save();

    // Send response
    return res.json(new_user);
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      message: "Ichki server xatosi!",
    });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password} = req.body;


    const findUser = await User.findOne({ email });
    if (!findUser || await findUser.isPasswordMatched(password)) {
      return res.status(401).json({
        message: "bk"
      })
    }

    const refreshToken = await generateRefreshToken(findUser._id);

    const updatedUser = await User.findByIdAndUpdate(
      findUser._id,
      { refreshToken },
      { new: true }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    const accessToken = generateToken(updatedUser._id);

    return res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      token: accessToken
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ichki server xatosi!" });
  }
};

const views = async (req, res) => {
    try {
        const allUser = await User.find()
        if(!allUser) {
            return res.status(400).json({message: "Foydalanuvchilar topilmadi"})
        }
        return res.status(200).json({message: "Barcha foydalanuvchilar", user: allUser})
    } catch (error) {
        console.error(error);
        res.status(500).json({
          message: "Nimadir xato ketdi. Iltimos keyinroq qayta urinib ko'ring!",
        });
    }
}

const view = async (req, res) => {
    const {id} = req.params;
    try {
        const user = await User.findById(id).populate("order")
        if(!user) {
            return res.status(400).json({message: "Foydalanuvchilar topilmadi"})
        }
        return res.status(200).json({message: "foydalanuvchi topildi", user})
    } catch (error) {
        console.error(error);
        res.status(500).json({
          message: "Nimadir xato ketdi. Iltimos keyinroq qayta urinib ko'ring!",
        });
    }
}

const deleted = async (req, res) => {
    const {id} = req.params
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
          }
      
          res.json({ message: "Foydalanuvchi muafaqiyatli o'chirildi" });
    } catch (error) {
        console.error(error);
      res.status(500).json({ error: "Server error" });
    }
}

const update = async(req,res) => {
    const {id} = req.params;
    const {email, password} = req.body;

    try{
        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                email, password
            },
            {new: true}
        );
        if(!updatedUser) {
            return res.status(400).json({message: `${email, password} topilmadi`})
        }
        res.status(200).json({message: "Muafaqiyatli bajarildi",  updatedUser})
    }catch(error) {
        console.log(error)
        res.status(500).json({
            message: "Nimadir xato ketdi. Iltimos keyinroq qayta urinib ko'ring!",
          });
    }
}

const getWishlist = async (req, res) => {
  const { id } = req.user;
  try {
    const findUser = await User.findById(id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createUser,
  loginUser,
  views,
  view,
  deleted,
  update,
  getWishlist
};


