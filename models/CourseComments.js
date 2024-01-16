module.exports = (sequelize, DataTypes) => {
  const CourseComments = sequelize.define("CourseComments", {
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

    courseId: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  });
  return CourseComments;
};
