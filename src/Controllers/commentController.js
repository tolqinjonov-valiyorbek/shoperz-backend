const Comment = require("../models/Comment");
const Product = require("../models/Product.js");

const postComment = async (req, res) => {
  const { productId } = req.params;
  const { text } = req.body;

  try {
    if (!productId || !text) {
      return res
        .status(400)
        .json({ message: "Mahsulot ID va matn talab qilinadi!" });
    }

    // Mahsulotni topish
    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      return res.status(404).json({
        message: `Afsuski, ${productId} ID bilan mahsulot topilmadi!`,
      });
    }

    // Yangi izohni yaratish
    const newComment = new Comment({ text, productId, user: req.user._id });
    await newComment.save();

    // Mahsulotga izohni qo'shish
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $push: { comments: newComment._id } }, // Izohni mahsulotga qo'shish
      { new: true }
    );

    res.status(201).json({
      message: "Izohingiz qo'shildi!",
      comment: newComment,
      updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Ichki server xatosi yuz berdi. Iltimos keyinroq urinib ko'ring!",
    });
  }
};

const editComment = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  try {
    if (!text) {
      return res
        .status(400)
        .json({ message: "Izoh uchun matn talab qilinadi!" });
    }

    const comment = await Comment.findOneAndUpdate({_id: id, user: req.user._id}, {text});

    if(!comment) {
      return res.status(404).json({
        message: "Bunday comment topilmadi"
      })
    }

    res.status(201).json({
      message: "Ushbu izoh tahrirlandi",
      comment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Nimadir xato ketdi. Iltimos keyinroq qayta urinib ko'ring!",
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    // O'chirilayotgan commentni topish
    const deletedComment = await Comment.findOneAndDelete({_id: commentId, user: req.user._id});

    if (!deletedComment) {
      return res.status(404).json({ message: "Comment topilmadi" });
    }
    
    // Productni ichidagi comments massivini filter qilish va o'chirish
    let {comments} = await Product.findById(deletedComment.productId);

    const filterComments = comments.filter((comment) => {
      return comment != commentId
    })

    await Product.findByIdAndUpdate(deletedComment.productId, {
      comments: [...filterComments]
    })

    return res
      .status(200)
      .json({ message: "Muafaqiyatli o'chirildi", deletedComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Xatolik yuz berdi" });
  }
};

module.exports = {
  postComment,
  editComment,
  deleteComment,
};
