const express = require("express");
const router = express.Router();
const BlogController = require("../../../../../controller/api/v1/student/blog");

router.get("/", BlogController.getPosts);
router.get("/:slug", BlogController.getSinglePost);

module.exports = router;
