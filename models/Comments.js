module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define("Comments", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    courseId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    parentId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    published: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  Comments.associate = function (models) {
    Comments.hasMany(models.CommentReplies, {
      foreignKey: "commentId",
      as: "replies",
    });
    Comments.belongsTo(models.Users, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return Comments;
};
