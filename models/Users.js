module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "Users",
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      postalCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "2000",
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      language: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "en",
      },
      timezone: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "gmt-05",
      },
      emailVerification: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "0",
      },
      dateOfBirth: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      vip: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      registerStep: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      forgotToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contract: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      referralCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      stripeCustomerId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      credit: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
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
      tableName: "users",
    }
  );
  // Add this method to your model
  Users.associate = function (models) {
    Users.belongsToMany(models.Courses, {
      through: "TeacherPerCourse",
      foreignKey: "teacherId",
      otherKey: "courseId",
      as: "courses",
    });

    Users.hasMany(models.Referral, {
      foreignKey: "referrerId",
      as: "referralsMade",
    });

    Users.hasOne(models.Referral, {
      foreignKey: "referredId",
      as: "referralReceived",
    });
    Users.belongsToMany(models.Webinars, {
      through: "UserWebinars", // Name of the junction table (might differ in your setup)
      foreignKey: "userId",
      as: "registeredWebinars",
    });
  };
  return Users;
};
