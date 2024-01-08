module.exports = (sequelize, DataTypes) => {
  const TransactionCourses = sequelize.define(
    "TransactionCourses",
    {
      Transaction_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "transactioncourses",
    }
  );

  return TransactionCourses;
};
