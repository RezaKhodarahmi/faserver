module.exports = (sequelize, DataTypes) => {
  const CommentReplies = sequelize.define(
    "CommentReplies",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      commentId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "commentreplies",
    }
  );
  return CommentReplies;
};
