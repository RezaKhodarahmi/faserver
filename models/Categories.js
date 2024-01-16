module.exports = (sequelize, DataTypes) => {
  const Categories = sequelize.define("Categories", {
    parentId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    keywords: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metaTitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metaDescription: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 1,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });
  Categories.associate = function (models) {
    Categories.belongsToMany(models.Courses, {
      through: "CoursePerCategory", // this is the table that will act as the junction table
      foreignKey: "categoryId",
      otherKey: "courseId",
      as: "courses", // alias
    });
  };
  return Categories;
};
