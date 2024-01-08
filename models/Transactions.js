module.exports = (sequelize, DataTypes) => {
  const Transactions = sequelize.define(
    "Transactions",
    {
      Transaction_ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      courseId: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      cycleId: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      Stripe_Charge_ID: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      Amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      Currency: {
        type: DataTypes.CHAR(3),
        allowNull: true,
      },
      Transaction_Date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      Transaction_Status: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "Pending",
      },
      Transaction_Type: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "Stripe",
      },
      coupons: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "transactions",
    }
  );
  Transactions.associate = (models) => {
    Transactions.belongsTo(models.Users, {
      foreignKey: "userId",
      as: "user",
    });

    Transactions.belongsToMany(models.Courses, {
      through: "TransactionCourses",
      foreignKey: "Transaction_ID",
      otherKey: "courseId",
      as: "courses",
    });

    Transactions.belongsToMany(models.CourseCycles, {
      through: "TransactionCycles",
      foreignKey: "Transaction_ID",
      otherKey: "cycleId",
      as: "cycles",
    });
  };

  return Transactions;
};
