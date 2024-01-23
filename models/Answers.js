module.exports = (sequelize, DataTypes) => {
  const Answers = sequelize.define("Answers", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    questionId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    answerText: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isCorrect: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },
  });
  // Add this block after the existing code
  // Answers.associate = function (models) {
  //   Answers.belongsTo(models.Questions, {
  //     foreignKey: "questionId",
  //     as: "question",
  //   });
  // };
  return Answers;
};
