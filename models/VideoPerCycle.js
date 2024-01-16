module.exports = (sequelize, DataTypes) => {
  const VideoPerCycle = sequelize.define("VideoPerCycle", {
    videoId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    cycleId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  });

  return VideoPerCycle;
};
