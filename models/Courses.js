module.exports = (sequelize, DataTypes) => {
  const Courses = sequelize.define(
    "Courses",
    {
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
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      abstract: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      keywords: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      metaTitle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      metaDescription: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 1,
      },
      activeList: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 0,
      },
      certificate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      introURL: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      introPoster: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "courses",
    }
  );

  Courses.associate = function (models) {
    Courses.hasMany(models.CourseCycles, {
      foreignKey: "courseId",
      as: "cycles",
    });
    Courses.belongsToMany(models.Categories, {
      through: "CoursePerCategory", // this is the table that will act as the junction table
      foreignKey: "courseId",
      otherKey: "categoryId",
      as: "categories", // alias
    });

    Courses.belongsToMany(models.Users, {
      through: "TeacherPerCourse", // this is the table that will act as the junction table
      foreignKey: "courseId",
      otherKey: "teacherId",
      as: "teachers", // alias
    });
    Courses.belongsToMany(models.Tests, {
      through: "TestPerCycles",
      foreignKey: "courseId",
      otherKey: "testId",
      as: "tests", // alias
    });
    Courses.belongsToMany(models.Videos, {
      through: "VideoPerCycles",
      foreignKey: "courseId",
      otherKey: "videoId",
      as: "videos", // alias
    });
    Courses.belongsToMany(models.Comments, {
      through: "CourseComments",
      foreignKey: "courseId",
      otherKey: "commentId",
      as: "comments", // alias
    });
  };

  return Courses;
};
