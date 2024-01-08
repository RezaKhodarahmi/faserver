module.exports = (sequelize, DataTypes) => {
  const Videos = sequelize.define(
    "Videos",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      courseId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cycleId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      secId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      time: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      needEnroll: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "1",
      },
    },
    {
      tableName: "videos",
    }
  );

  return Videos;
};
