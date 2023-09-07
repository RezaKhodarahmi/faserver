module.exports = (sequelize, DataTypes) => {
  const CourseCycles = sequelize.define("CourseCycles", {
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
    startDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vacationStart: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    secId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    vacationEnd: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    regularPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    vipPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    days: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vipAccess: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 0,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "20",
    },
    retake: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 0,
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
  CourseCycles.associate = function (models) {
    CourseCycles.belongsTo(models.Courses, {
      foreignKey: "courseId",
      as: "course",
    });
    CourseCycles.hasMany(models.Tests, {
      foreignKey: "cycleId",
      as: "tests",
    });
  };

  return CourseCycles;
};
