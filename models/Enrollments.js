module.exports = (sequelize, DataTypes) => {
  const Enrollments = sequelize.define("Enrollments", {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    courseId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    cycleId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    Transaction_ID: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    enrollmentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },
    completionDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    cancelled: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },
    cancellationResult: {
      type: DataTypes.STRING,
      allowNull: true,
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
  return Enrollments;
};
