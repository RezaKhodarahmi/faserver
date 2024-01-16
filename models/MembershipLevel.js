module.exports = (sequelize, DataTypes) => {
  const MembershipLevels = sequelize.define("MembershipLevels", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    regularPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "365",
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 1,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  return MembershipLevels;
};
