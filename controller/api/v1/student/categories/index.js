const Categories = require("../../../../../models").Categories;

const getCategories = async (req, res) => {
  try {
    const categories = await Categories.findAll({ where: { status: 1 } });
    return res.status(200).json({
      data: categories,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error!",
      error: true,
    });
  }
};
module.exports = { getCategories };
