const Posts = require("../../../../../models").Posts;

const getPosts = async (req, res) => {
  try {
    const posts = await Posts.findAll({ where: { published: 1 } });
    return res.status(200).json({
      data: posts,
      error: false,
    });
  } catch (error) {
    console.error(error);
    return res.status(200).json({
      message: "Server Error!",
      error: true,
    });
  }
};
const getSinglePost = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await Posts.findOne({ where: { slug, status: 1 } });
    if (!post) {
      return res.status(404).json({
        message: "Post not found!",
        error: true,
      });
    }
    return res.status(200).json({
      data: post,
      error: false,
    });
  } catch (error) {
    console.error(error);
    return res.status(200).json({
      message: "Server Error!",
      error: true,
    });
  }
};

module.exports = { getPosts, getSinglePost };
