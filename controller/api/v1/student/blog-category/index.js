const BlogCategories = require("../../../../../models").BlogCategories;

const getCategories = async (req, res) => {
  try {
    const categories = await BlogCategories.findAll({ where: { status: 1 } });
    return res.status(200).json({
      data: categories,
      error: false,
    });
  } catch (error) {
    console.error(error);
    return res.status(200).json({
      message: "Server Error!",
      error: true,
    });
  }
};
const getSingleCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await BlogCategories.findOne({
      where: { slug, status: 1 },
    });
    if (!category) {
      return res.status(404).json({
        message: "category not found!",
        error: true,
      });
    }
    return res.status(200).json({
      data: category,
      error: false,
    });
  } catch (error) {
    console.error(error);
    return res.status(200).json({
      message: "Server Error!",
      error: true,
    });
  }
};

module.exports = { getCategories, getSingleCategory };
