module.exports = (sequelize, DataTypes) => {
  const TransactionCycles = sequelize.define("TransactionCycles", {
    Transaction_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    cycleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return TransactionCycles;
};
