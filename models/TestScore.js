module.exports = (sequelize, DataTypes) => {
  const TestScore = sequelize.define(
    "TestScore",
    {
      answerId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      userID: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      questionId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      responseText: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "testscore",
    }
  );
  return TestScore;
};
