module.exports = (sequelize, DataTypes) => {
  const Tests = sequelize.define("Tests", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    cycleId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    repetition: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "0",
    },
    testDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    testTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    agenda: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    needEnroll: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 1,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 1,
    },
  });
  Tests.associate = function (models) {
    Tests.hasMany(models.Questions, {
      foreignKey: "testId",
      as: "questions",
    });
    // Tests.belongsToMany(models.Courses, {
    //   through: "TestPerCycle",
    //   foreignKey: "testId",
    //   otherKey: "courseId",
    //   as: "tests", // alias
    // });
  };

  return Tests;
};
