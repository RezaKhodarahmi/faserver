const express = require("express");
const router = express.Router();
const BlogCategoryController = require("../../../../../controller/api/v1/student/blog-category");

router.get("/", BlogCategoryController.getCategories);
router.get("/:slug", BlogCategoryController.getSingleCategory);

module.exports = router;
