module.exports = (sequelize, DataTypes) => {
  const Coupon = sequelize.define(
    "Coupon",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      discount_percentage: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 100,
        },
      },
      discount_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          min: 0,
        },
      },
      course_id: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      is_used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      minimum_spend: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          min: 0,
        },
      },
      maximum_spend: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          min: 0,
        },
      },
      individual_use_only: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      exclude_products: {
        type: DataTypes.JSON, // or DataTypes.TEXT if using text for product IDs
        allowNull: true,
      },
      allowed_emails: {
        type: DataTypes.JSON, // or DataTypes.TEXT if using text for email addresses
        allowNull: true,
      },
      exclude_sale_items: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      usage_limit_per_coupon: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      usage_limit_per_user: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "coupon",
    }
  );

  return Coupon;
};
