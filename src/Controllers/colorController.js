const Color = require("../models/Color.js");
const Product = require("../models/Product.js");

const createColor = async (req, res) => {
  const { productId, name } = req.body; 
  try {
    let product; // Mahsulot obyekti

    // productId berilgan bo'lsa, mos mahsulotni topamiz
    if (productId) {
      product = await Product.findById(productId);
      if (!product) {
        return res.status(400).json({ message: `Berilgan ID ga mos mahsulot topilmadi!` });
      }
    }

    const existingColor = await Color.findOne({name})
    if(existingColor){
      return res.status(401).json({
        message: "Bunday nomli rang allaqachon mavjud"
      })
    }

    // Yangi rangni yaratish va saqlash
    const newColor = new Color({ name });
    await newColor.save();

    // Agar product mavjud bo'lsa, rangni mahsulotga qo'shamiz
    if (product) {
      product.color.push(newColor);
      await product.save();
    }

    res.status(201).json({
      message: "Rang muvaffaqiyatli qo'shildi!",
      newColor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Nimadir xato ketdi. Iltimos keyinroq qayta urinib ko'ring!",
    });
  }
};

const updateColor = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
      const updatedColor = await Color.findByIdAndUpdate(
        id,
        {name }, // name ni obyekt ichida o'zgartirish
        { new: true }
      );
      if (!updatedColor) {
        return res.status(400).json({ message: "Rang topilmadi" });
      }
      res.status(200).json({ message: "Muafaqiyatli o'zgartirldi", updatedColor });
    } catch (error) {
      res.status(500).json({
        message: "Nimadir xato ketdi. Iltimos keyinroq qayta urinib ko'ring!",
      });
    }
};

const viewsColor = async(req, res) => {
    try {
        const allColor = await Color.find()
        if(!allColor) {
            return res.status(400).json({message: "Ranglar topilmadi"})
        }
        return res.status(200).json({message: "Barcha ranglar", color: allColor})
    } catch (error) {
        console.error(error);
        res.status(500).json({
          message: "Nimadir xato ketdi. Iltimos keyinroq qayta urinib ko'ring!",
        });
    }
};

const viewColor = async(req, res) => {
    const {id} = req.params;
    try {
        const color = await Color.findById(id);
        if(!color) {
            return res.status(400).json({message: "Rang topilmadi"})
        }
        return res.status(200).json({message: "Rang topildi", color})
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:"Nimadir xatolik ketdi. Iltimos keyinroq qayta urinib ko'ring!"
        })
    }
};

const deleteColor = async(req, res) => {
    const {id} = req.params;
    try {
        const deletedColor = await Color.findByIdAndDelete(id);
        if(!deletedColor) {
            return res.status(400).json({message: "Id topilmadi"})
        }
        return res.status(200).json({message: "Rang muafaqiyatli o'chirildi"})
    } catch (error) {
        console.log(error);
         res.status(500).json({message:"Nimadir xatolik ketdi. Iltimos keyinroq urinib ko'ring"})
    }
};
module.exports = {
    createColor,
    updateColor,
    viewsColor,
    viewColor,
    deleteColor
}