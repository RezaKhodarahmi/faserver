const express = require("express");
const router = express.Router();
const PostController = require("../../../../controller/api/v1/post");
const { checkToken } = require("../../../../utils/verifyAccessToken");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/blog/posts");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toString().replace(/:/g, "_") + file.originalname);
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
