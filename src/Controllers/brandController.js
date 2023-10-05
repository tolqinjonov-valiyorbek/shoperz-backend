const Brand = require("../models/Brand.js");
const Product = require("../models/Product.js");

const createBrand = async (req, res) => {
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
  
      // Yangi brandni yaratish va saqlash
      const newBrand = new Brand({ name });
      await newBrand.save();
  
      // Agar product mavjud bo'lsa, brandni mahsulotga qo'shamiz
      if (product) {
        product.brand.push(newBrand);
        await product.save();
      }
  
      res.status(201).json({ message: "Brand muvaffaqiyatli qo'shildi!", newBrand });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Nimadir xato ketdi. Iltimos keyinroq qayta urinib ko'ring!" });
    }
};

const updateBrand = async(req, res) => {
    const {id} = req.params;
    const { name } = req.body;
    try {
      const updatedBrand = await Brand.findByIdAndUpdate(
        id,
        {name }, // name ni obyekt ichida o'zgartirish
        { new: true }
      );
      if (!updatedBrand) {
        return res.status(400).json({ message: "Brand topilmadi" });
      }
      res.status(200).json({ message: "Muafaqiyatli o'zgartirldi", updatedBrand });
    } catch (error) {
      res.status(500).json({
        message: "Nimadir xato ketdi. Iltimos keyinroq qayta urinib ko'ring!",
      });
    }
};

const viewsBrand = async(req, res) => {
    try {
        const allBrand = await Brand.find()
        if(!allBrand) {
            return res.status(400).json({message: "brandlar topilmadi"})
        }
        return res.status(200).json({message: "Barcha brandlar", brand: allBrand})
    } catch (error) {
        console.error(error);
        res.status(500).json({
          message: "Nimadir xato ketdi. Iltimos keyinroq qayta urinib ko'ring!",
        });
    }
};

const viewBrand = async(req, res) => {
    const {id} = req.params;
    try {
        const brand = await Brand.findById(id);
        if(!brand) {
            return res.status(400).json({message: "Brand topilmadi"})
        }
        return res.status(200).json({message: "Brand topildi", brand})
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:"Nimadir xatolik ketdi. Iltimos keyinroq qayta urinib ko'ring!"
        })
    }
};

const deleteBrand = async(req, res) => {
    const {id} = req.params;
    try {
        const deletedBrand = await Brand.findByIdAndDelete(id);
        if(!deletedBrand) {
            return res.status(400).json({message: "Id topilmadi"})
        }
        return res.status(200).json({message: "Brand muafaqiyatli o'chirildi", brand: deletedBrand})
    } catch (error) {
        console.log(error);
         res.status(500).json({message:"Nimadir xatolik ketdi. Iltimos keyinroq urinib ko'ring"})
    }
};

const filterByBrand = async (req, res) => {
  const brand = req.params.brand;
  try {
    // Kategoriya nomiga mos mahsulotlarni izlash
    const productsInBrand = await Product.find({ 'brand.name': brand }).populate("brand");

    if (!productsInBrand || productsInBrand.length === 0) {
      return res.status(404).json({ message: "Brand bo'yicha mahsulotlar topilmadi" });
    }

    res.status(200).json({ message: "Brand bo'yicha mahsulotlar", products: productsInBrand });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xatosi yuz berdi' });
  }
};


module.exports = {
    createBrand,
    updateBrand,
    viewsBrand,
    viewBrand,
    deleteBrand,
    filterByBrand
}