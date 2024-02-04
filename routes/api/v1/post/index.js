const express = require("express");
const router = express.Router();
const PostController = require("../../../../controller/api/v1/post");
const { checkToken } = require("../../../../utils/verifyAccessToken");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/blog/posts");
  },
  filename: function (req, file, cb) {
    // Generate a unique file name with the original extension
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
router.get("/", checkToken, PostController.getPosts);
router.post(
  "/create",
  checkToken,
  upload.single("image"),
  PostController.creteNewPost
);
router.patch(
  "/update",
  checkToken,
  upload.single("image"),
  PostController.updatePost
);
router.get("/:id", checkToken, PostController.getPostWithId);
router.delete("/:id", checkToken, PostController.deletePost);

module.exports = router;
