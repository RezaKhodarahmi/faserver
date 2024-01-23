module.exports = (sequelize, DataTypes) => {
  const BlogCategories = sequelize.define("BlogCategories", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
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
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
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
  // BlogCategories.associate = (models) => {
  //   BlogCategories.belongsToMany(models.Posts, {
  //     through: models.PostCategory,
  //     foreignKey: "catId",
  //     otherKey: "postId",
  //   });
  // };
  return BlogCategories;
};
