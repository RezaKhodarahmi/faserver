module.exports = (sequelize, DataTypes) => {
  const TeacherPerCourse = sequelize.define("TeacherPerCourse", {
    teacherId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    cycleId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  });
  return TeacherPerCourse;
};
