module.exports = (sequelize, DataTypes) => {
  const BlogTags = sequelize.define("BlogTags", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
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
  BlogTags.associate = (models) => {
    BlogTags.belongsToMany(models.Posts, {
      through: models.PostTag,
      foreignKey: "postId",
      otherKey: "tagId",
    });
  };
  return BlogTags;
};
