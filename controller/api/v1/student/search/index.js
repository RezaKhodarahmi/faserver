const { Op } = require("sequelize");
const Courses = require("../../../../../models").Courses;
const Categories = require("../../../../../models").Categories;
const CourseCycles = require("../../../../../models").CourseCycles;
const Validation = require("../../../../../utils/dashboard/validationSchema");

const searchCourse = async (req, res) => {
  try {
    const { searchTerm } = req.params;

    // Validate searched param
    const { err } = Validation.validateSearchQuery(searchTerm);
    if (err) {
      return res.status(401).json({
        message: err.details[0].message,
        error: true,
      });
    }

    // Search in both title and associated category title
    const results = await Courses.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${searchTerm}%` } },
          { "$categories.title$": { [Op.like]: `%${searchTerm}%` } },
        ],
      },
      include: [
        {
          model: Categories,
          as: "categories", // make sure this alias matches the one defined in the association
          required: false,
        },
        {
          model: CourseCycles,
          as: "cycles",
          required: true,
        },
      ],
    });

    return res.status(200).json({
      error: false,
      data: results,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server Error!",
      error: true,
    });
  }
};

module.exports = { searchCourse };
