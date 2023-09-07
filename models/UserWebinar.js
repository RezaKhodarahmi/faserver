module.exports = (sequelize, DataTypes) => {
  const UserWebinars = sequelize.define("Webinars", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    webinarId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "webinars",
        key: "id",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
  UserWebinars.associate = function (models) {
    UserWebinars.belongsTo(models.Users, {
      foreignKey: "userId",
      as: "user",
    });

    UserWebinars.belongsTo(models.Webinars, {
      foreignKey: "webinarId",
      as: "webinar",
    });
  };

  return UserWebinars;
};
