module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define(
    "Posts",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      authorId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "The authorId must not be null",
          },
        },
      },
      parentId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "The title must not be null",
          },
          len: {
            args: [5, 100],
            msg: "The title should be between 5 and 100 characters long",
          },
        },
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "The slug must not be null",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      summary: {
        type: DataTypes.TEXT,
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
      published: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      image: {
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
    },
    {
      hooks: {
        beforeValidate: (post, options) => {
          if (!post.slug) {
            post.slug = post.title
              .toLowerCase()
              .replace(/\s+/g, "-")
              .substring(0, 200);
          }
        },
        beforeDestroy: async (post, options) => {
          const { models } = sequelize;
          await models.PostCategory.destroy({ where: { postId: post.id } });
          await models.PostTag.destroy({ where: { postId: post.id } });
        },
      },
    }
  );

  // Posts.associate = (models) => {
  //   Posts.belongsToMany(models.BlogCategories, {
  //     through: models.PostCategory,
  //     foreignKey: "postId",
  //     otherKey: "catId",
  //   });
  //   Posts.belongsToMany(models.BlogTags, {
  //     through: models.PostTag,
  //     foreignKey: "postId",
  //     otherKey: "tagId",
  //   });
  // };

  return Posts;
};
