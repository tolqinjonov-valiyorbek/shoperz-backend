const Category = require("../models/Category.js");
const Product = require("../models/Product.js");

const createCategory = async(req,res) => {
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

      const existingCategory = await Category.findOne({name})

      if(existingCategory) {
        return res.status(400).json({
          message: "Bunday nomli Kategoriya allaqachon mavjud"
        })
      }
  
      // Yangi brandni yaratish va saqlash
      const newCategory = new Category({ name });
      await newCategory.save();
  
      // Agar product mavjud bo'lsa, brandni mahsulotga qo'shamiz
      if (product) {
        product.category.push(newCategory);
        await product.save();
      }
  
      res.status(201).json({ message: "Category muvaffaqiyatli qo'shildi!", newCategory });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Nimadir xato ketdi. Iltimos keyinroq qayta urinib ko'ring!" });
    }
};

const updateCategory = async(req,res) => {
    const {id} = req.params;
    const { name } = req.body;
    try {
      const updatedCategory = await Category.findByIdAndUpdate(
        id,
        {name }, // name ni obyekt ichida o'zgartirish
        { new: true }
      );
      if (!updatedCategory) {
        return res.status(400).json({ message: "Category topilmadi" });
      }
      res.status(200).json({ message: "Muafaqiyatli o'zgartirldi", updatedCategory });
    } catch (error) {
      res.status(500).json({
        message: "Nimadir xato ketdi. Iltimos keyinroq qayta urinib ko'ring!",
      });
    }
};

const viewsCategory = async(req,res) => {
    try {
        const allCategory = await Category.find()
        if(!allCategory) {
            return res.status(400).json({message: "kategorya topilmadi"})
        }
        return res.status(200).json({message: "Barcha kategorya", brand: allCategory})
    } catch (error) {
        console.error(error);
        res.status(500).json({
          message: "Nimadir xato ketdi. Iltimos keyinroq qayta urinib ko'ring!",
        });
    }
};

const deleteCategory = async(req, res) => {
    const {id} = req.params;
    try {
        const deletedCategory = await Category.findByIdAndDelete(id);
        if(!deletedCategory) {
            return res.status(400).json({message: "Id topilmadi"})
        }
        return res.status(200).json({message: "Kategorya muafaqiyatli o'chirildi", brand: deletedCategory})
    } catch (error) {
        console.log(error);
         res.status(500).json({message:"Nimadir xatolik ketdi. Iltimos keyinroq urinib ko'ring"})
    }
};

const filterByCategory = async (req, res) => {
  const category = req.params.category;
  try {
    // Kategoriya nomiga mos mahsulotlarni izlash
    const productsInCategory = await Product.find({ 'category.name': category }).populate("category");

    if (!productsInCategory || productsInCategory.length === 0) {
      return res.status(404).json({ message: "Kategoriya bo'yicha mahsulotlar topilmadi" });
    }

    res.status(200).json({ message: "Kategoriya bo'yicha mahsulotlar", products: productsInCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xatosi yuz berdi' });
  }
};

module.exports = {
    createCategory,
    updateCategory,
    viewsCategory,
    deleteCategory,
    filterByCategory
}