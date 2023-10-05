const Product = require("../models/Product.js");
const User = require("../models/User.js");
const FuseJs = require("fuse.js");
const Color = require("../models/Color.js");

const createProduct = async (req, res) => {
  const {
    name,
    description,
    Specifications,
    price,
    year,
    category,
    brand,
    ram,
    processor,
    quantity,
    sold,
    images,
    color,
    rating,
    tags
  } = req.body;
  try {
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res
        .status(400)
        .json({ message: `Bu "${name}"  allaqachon mavjud!` });
    }

    const newProduct = new Product({
      name,
      description,
      Specifications,
      price,
      year,
      category,
      brand,
      ram,
      processor,
      quantity,
      sold,
      images,
      color,
      rating,
      tags
    });
    const createdProduct = await newProduct.save();
    res.status(201).json({
      message: "Mahsulot muvaffaqiyatli qo'shildi!",
      product: createdProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    Specifications,
    price,
    category,
    brand,
    quantity,
    sold,
    images,
    videos,
    color,
    rating,
  } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
     { name,
      description,
      Specifications,
      price,
      category,
      brand,
      quantity,
      sold,
      images,
      videos,
      color,
      rating},
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Muafaqiyatli o'zgartirildi", updatedProduct });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Nimadir xato ketdi. Iltimos keyinroq qayta urinib ko'ring!",
    });
  }
};

const viewsProduct = async(req, res) => {
    try {
        const allProducts = await Product.find()
        if(!allProducts) {
            return res.status(400).json({message:"mahsulotlar topilmadi"})
        }

       return res.status(200).json({message: "Barcha mahsulotlar", allProducts})
    } catch (error) {
        console.error(error);
        res.status(500).json({
          message: "Nimadir xato ketdi. Iltimos keyinroq qayta urinib ko'ring!",
        });
    }
};

const viewProduct = async(req, res) => {
  const {id} = req.params;
  try {
      const product = await Product.findById(id).populate("color").populate("brand").populate("category").populate("comments").populate("ram").populate("processor");
      if(!product) {
          return res.status(400).json({message: "Mahsulot topilmadi"})
      }
      return res.status(200).json({message: "Mahulot topildi", product})
  } catch (error) {
      console.log(error)
      res.status(500).json({
          message:"Nimadir xatolik ketdi. Iltimos keyinroq qayta urinib ko'ring!"
      })
  }
};

const deleteProduct = async(req, res) => {
  const {id} = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if(!deletedProduct) {
      return res.status(400).json({message: "Id topilmadi"})
  }
  return res.status(200).json({message: "Mahsulot muafaqiyatli o'chirildi"})
} catch (error) {
  console.log(error);
   res.status(500).json({message:"Nimadir xatolik ketdi. Iltimos keyinroq urinib ko'ring"})
}
  
};

const paginations = async(req, res) => {
  try {
    // data
    const { page } = req.query;
    const itemsPerPage = 20;

    // validation
    if (page) {
      const pageNumber = parseInt(page);
      const skipCount = (pageNumber - 1) * itemsPerPage;

      // Count total movies
      const totalProducts = await Product.countDocuments();

      // Get paginated movies
      const product = await Product.find()
        .skip(skipCount)
        .limit(itemsPerPage);

      // send response
      res.send({
        data: product,
        totalProducts,
        totalPages: Math.ceil(totalProducts / itemsPerPage),
        currentPage: pageNumber,
      });
    } else {
      // send response
      res.send({
        message: "page maydoni qilinadi!",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Nimadir xato ketdi!" });
  }
};

const filterPrice = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;

    // Narx miqdorlarini sonlarga o'tkazamiz
    const minPriceNum = parseFloat(minPrice);
    const maxPriceNum = parseFloat(maxPrice);

    if (isNaN(minPriceNum) || isNaN(maxPriceNum)) {
      return res.status(400).json({ error: "Narxlar son bo'lishi kerak" });
    }

    // Ma'lumotlar bazasidan narxga qarab mahsulotlarni qidirish
    const filteredProducts = await Product.find({
      price: { $gte: minPriceNum, $lte: maxPriceNum },
    });

    res.json(filteredProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Serverda xato yuz berdi" });
  }
};

const addToWishlist = async (req, res) => {
  const { productId, userId } = req.body;
  try {
    const user = await User.findById(userId);
    const alreadyAdded = user.wishlist.find((item) => item.toString() === productId);

    if (alreadyAdded) {
      // Mahsulotni "wishlist"dan o'chirish
      user.wishlist.pull(productId);
    } else {
      // Mahsulotni "wishlist"ga qo'shish
      user.wishlist.push(productId);
    }

    await user.save(); // Foydalanuvchini saqlash
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
};

const search = async(req, res) => {
	const searchQuery = req.query.name
	try{
		const products = await Product.find()

		if(!products){
			res.status(404).json({
				message: "Mahsulotlar topilmadi" 
			})
		}

		const options = {
			includeScore: true,
			keys: ["name"]
		}

		const fuse = new FuseJs(products, options)

		const result = fuse.search(searchQuery)

		res.status(201).json({
			message: "Search result",
			data: result
		})

	}catch(error){
		console.error(error);
		res.status(500).json({ message: "Nimadir xato ketdi. Iltimos keyinroq qayta urinib ko'ring!" });
	}
};

module.exports = {
  createProduct,
  updateProduct,
  viewsProduct,
  viewProduct,
  deleteProduct,
  paginations,
  filterPrice,
  addToWishlist,
  search
};
