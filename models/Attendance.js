module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define("Attendance", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    cycleId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    classNo: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    studentId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    timeArrive: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timeLeave: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  return Attendance;
};
