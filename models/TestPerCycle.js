module.exports = (sequelize, DataTypes) => {
  const TestPerCycle = sequelize.define(
    "TestPerCycle",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
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
    },
    {
      tableName: "testpercycle",
    }
  );

  return TestPerCycle;
};
