const Processor = require("../models/Processor.js");
const Product = require("../models/Product.js");

const createProcessor = async (req, res) => {
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
      const newProcessor = new Processor({ name });
      await newProcessor.save();
  
      // Agar product mavjud bo'lsa, brandni mahsulotga qo'shamiz
      if (product) {
        product.processor.push(newProcessor);
        await product.save();
      }
  
      res.status(201).json({ message: "Processor muvaffaqiyatli qo'shildi!", newProcessor });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Nimadir xato ketdi. Iltimos keyinroq qayta urinib ko'ring!" });
    }
};

const updateProcessor = async(req, res) => {
  const {id} = req.params;
  const { name } = req.body;
  try {
    const updatedProcessor = await Processor.findByIdAndUpdate(
      id,
      {name }, // name ni obyekt ichida o'zgartirish
      { new: true }
    );
    if (!updatedProcessor) {
      return res.status(400).json({ message: "Processor topilmadi" });
    }
    res.status(200).json({ message: "Muafaqiyatli o'zgartirldi", updatedProcessor });
  } catch (error) {
    res.status(500).json({
      message: "Nimadir xato ketdi. Iltimos keyinroq qayta urinib ko'ring!",
    });
  }
};

const viewsProcessor = async(req, res) => {
  try {
      const allProcessor = await Processor.find()
      if(!allProcessor) {
          return res.status(400).json({message: "Processorlar topilmadi"})
      }
      return res.status(200).json({message: "Barcha Processorlar", processor: allProcessor})
  } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Nimadir xato ketdi. Iltimos keyinroq qayta urinib ko'ring!",
      });
  }
};

const deleteProcessor = async(req, res) => {
  const {id} = req.params;
  try {
      const deletedProcessor = await Processor.findByIdAndDelete(id);
      if(!deletedProcessor) {
          return res.status(400).json({message: "Id topilmadi"})
      }
      return res.status(200).json({message: "Processor muafaqiyatli o'chirildi", processor: deletedProcessor})
  } catch (error) {
      console.log(error);
       res.status(500).json({message:"Nimadir xatolik ketdi. Iltimos keyinroq urinib ko'ring"})
  }
};


const filterByProcessor = async (req, res) => {
  const processor = req.params.processor;
  try {
    // Kategoriya nomiga mos mahsulotlarni izlash
    const productsInProcessor = await Product.find({ 'processor.name': processor }).populate("processor");

    if (!productsInProcessor || productsInProcessor.length === 0) {
      return res.status(404).json({ message: "Processor bo'yicha mahsulotlar topilmadi" });
    }

    res.status(200).json({ message: "Processor bo'yicha mahsulotlar", products: productsInProcessor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xatosi yuz berdi' });
  }
};
module.exports = {
    createProcessor,
    updateProcessor,
    viewsProcessor,
    deleteProcessor,
    filterByProcessor

}