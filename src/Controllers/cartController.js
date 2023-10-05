const Product = require("../models/Product");
const Cart = require("../models/Cart");
const User = require("../models/User");

const addToCart = async (req, res) => {
  const { productId, quantity, color, price } = req.body;
  const userId = req.user._id;

  try {
    // Foydalanuvchi uchun savatcha obyektini olish
    let userCart = await Cart.findOne({ userId });

    if (!userCart) {
      // Foydalanuvchi savatchasi yo'q bo'lsa, yangi savatcha yaratish
      userCart = new Cart({ userId, items: [] });
    }

    // Mahsulotni topish
    const product = await Product.findById(productId).lean();

    if (!product) {
      return res.status(400).json({ message: `Berilgan ID ga mos mahsulot topilmadi!` });
    }

    
    
    if (quantity > product.quantity - product.sold) {
      return res.status(400).json({ message: `Mahsulot soni ${quantity} ta emas` });
    }

    // Yangi mahsulotni qo'shish
    const newCartItem = {
      productId,
      userId,
      quantity,
      color,
      price,
    };

    userCart.items.push(newCartItem);

    // Savatchani saqlash
    await userCart.save();

    // Foydalanuvchini yangilash
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { cart: userCart },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({ message: `Savatchada qo'shishda xatolik` });
    }

    res.status(201).json({ message: "Savatchaga muvaffaqiyatli qo'shildi!", userCart });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Ichki server xatosi yuz berdi. Iltimos keyinroq urinib ko'ring!",
    });
  }
};



const getUserCart = async (req, res) => {
  const { _id } = req.user;
  try {
    const cart = await Cart.find({ userId: _id });

    if (!cart) {
      return res.status(400).json({ message: "Savatcha topilmadi" });
    }

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Ichki server xatosi yuz berdi. Iltimos keyinroq urinib ko'ring!",
    });
  }
};

const deleteCart = async (req, res) => {
  const { _id } = req.user;
  const { cartItemId } = req.params;
  try {
    const deleteFromToCart = await Cart.deleteOne({
      userId: _id,
      _id: cartItemId,
    });
    if (!deleteFromToCart) {
      res.status(400).json({ message: "ID bo'yicha CART topilmadi" });
    }
    res
      .status(200)
      .json({ message: "Muafaqaiyatli o'chirildi", deleteFromToCart });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Nimadir xatolik ketdi Iltimos keyinroq yana urinib ko'ring",
    });
  }
};

const deleteRam = async (req, res) => {

};

module.exports = {
  addToCart,
  getUserCart,
  deleteCart,
};
