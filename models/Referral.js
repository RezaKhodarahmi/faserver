module.exports = (sequelize, DataTypes) => {
  const Referral = sequelize.define(
    "Referral",
    {
      referralId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      referrerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: {
        //   model: "users",
        //   key: "id",
        // },
      },
      transactionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        // references: {
        //   model: "transactions",
        //   key: "Transaction_ID",
        // },
      },
      referredId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: {
        // model: "users",
        //key: "id",
        // },
      },
      status: { type: DataTypes.STRING, allowNull: false },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      tableName: "classes",
    }
  );

  Referral.associate = (models) => {
    Referral.belongsTo(models.Users, {
      foreignKey: "referrerId",
      as: "referrer",
    });
    Referral.belongsTo(models.Users, {
      foreignKey: "referredId",
      as: "referred",
    });
  };

  return Referral;
};
