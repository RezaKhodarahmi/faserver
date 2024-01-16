module.exports = (sequelize, DataTypes) => {
  const CoursePerCategory = sequelize.define("CoursePerCategory", {
    courseId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  });
  return CoursePerCategory;
};
