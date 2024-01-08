module.exports = (sequelize, DataTypes) => {
  const Questions = sequelize.define(
    "Questions",
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
      questionText: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      secId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      questionType: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "1",
      },
      explanation: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "questions",
    }
  );

  Questions.associate = function (models) {
    Questions.hasMany(models.Answers, {
      foreignKey: "questionId",
      as: "answers",
    });
    Questions.belongsTo(models.Tests, {
      foreignKey: "testId",
      as: "test",
    });
  };
  return Questions;
};
