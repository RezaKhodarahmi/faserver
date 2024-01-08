const Comments = require("../../../../../models").Comments;
const CourseComments = require("../../../../../models").CourseComments;
const Users = require("../../../../../models").Users;

const createComment = async (req, res) => {
  try {
    const { courseId, parentId, email, content } = req.body;

    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status.json({
        error: true,
        message: "Only logged in users can post comments!",
      });
    }

    const newComment = await Comments.create({
      courseId,
      userId: user.id,
      parentId,
      content,
      userEmail: user.email,
      published: 0,
      publishedAt: Date.now(),
    });

    if (newComment.dataValues.id) {
      await CourseComments.create({
        commentId: newComment.dataValues.id,
        courseId: courseId,
      });
    }

    return res.status(201).json({
      error: false,
      newComment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error!");
  }
};

module.exports = { createComment };
