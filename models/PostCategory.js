module.exports = (sequelize, DataTypes) => {
  const PostCategory = sequelize.define(
    "PostCategory",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      postId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      catId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      tableName: "postcategory",
    }
  );

  return PostCategory;
};
