const Ram = require("../models/ram.js");
const Product = require("../models/Product.js");
const createRam = async (req, res) => {
  const { productId, size } = req.body;

  try {
    // Mahsulot obyektini olish
    let product;
    if (productId) {
      product = await Product.findById(productId);
      if (!product) {
        return res
          .status(400)
          .json({ message: `Berilgan ID ga mos mahsulot topilmadi!` });
      }
    }

    // Yangi RAM obyektini yaratish va saqlash
    const newRam = new Ram({ size });
    await newRam.save();

    // Agar product mavjud bo'lsa, RAM obyektini mahsulotga qo'shamiz
    if (product) {
      product.ram.push(newRam);
      await product.save();
    }

    res.status(201).json({ message: "Ram muvaffaqiyatli qo'shildi!", newRam });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Nimadir xato ketdi. Iltimos keyinroq qayta urinib ko'ring!",
    });
  }
};

const viewsRam = async (req, res) => {
  try {
    const allRam = await Ram.find();
    if (!allRam) {
      return res.status(400).json({ message: "brandlar topilmadi" });
    }
    return res.status(200).json({ message: "Barcha brandlar", brand: allRam });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Nimadir xato ketdi. Iltimos keyinroq qayta urinib ko'ring!",
    });
  }
};

const deleteRam = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRam = await Ram.findByIdAndDelete(id);
    if (!deletedRam) {
      return res.status(400).json({ message: "Id topilmadi" });
    }
    return res
      .status(200)
      .json({ message: "Brand muafaqiyatli o'chirildi", ram: deletedRam });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        message: "Nimadir xatolik ketdi. Iltimos keyinroq urinib ko'ring",
      });
  }
};

const filterByRam = async (req, res) => {
  const ram = req.params.ram;
  try {
    // Kategoriya nomiga mos mahsulotlarni izlash
    const productsInRam = await Product.find({ 'ram.size': ram }).populate("ram");

    if (!productsInRam || productsInRam.length === 0) {
      return res.status(404).json({ message: "Ram bo'yicha mahsulotlar topilmadi" });
    }

    res.status(200).json({ message: "Ram bo'yicha mahsulotlar", products: productsInRam });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xatosi yuz berdi' });
  }
};

module.exports = {
  createRam,
  viewsRam,
  deleteRam,
  filterByRam
};
