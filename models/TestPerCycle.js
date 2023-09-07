module.exports = (sequelize, DataTypes) => {
  const TestPerCycle = sequelize.define("TestPerCycle", {
    testId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    cycleId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  });

  return TestPerCycle;
};
