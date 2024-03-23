module.exports = (sequelize, DataTypes) => {
  const Counseling = sequelize.define("Counseling", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    employee: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  });
  return Counseling;
};
