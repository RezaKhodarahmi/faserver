module.exports = (sequelize, DataTypes) => {
  const CoursePerCycle = sequelize.define(
    "CoursePerCycle",
    {
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
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "coursepercycle",
    }
  );
  return CoursePerCycle;
};
