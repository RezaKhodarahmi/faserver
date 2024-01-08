module.exports = (sequelize, DataTypes) => {
  const PostTag = sequelize.define(
    "PostTag",
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
      tagId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      tableName: "posttag",
    }
  );
  return PostTag;
};
