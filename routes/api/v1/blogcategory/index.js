const express = require("express");
const router = express.Router();
const BlogCategoryController = require("../../../../controller/api/v1/blogcategory");
const { checkToken } = require("../../../../utils/verifyAccessToken");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/blog/categories");
  },
  filename: function (req, file, cb) {
    // Generate a unique file name with the original extension
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
router.get("/", checkToken, BlogCategoryController.getCategories);
router.post(
  "/create",
  checkToken,
  upload.single("image"),
  BlogCategoryController.createCategory
);
router.get("/:id", BlogCategoryController.getCategoryWithId);
router.patch(
  "/update",
  checkToken,
  upload.single("image"),
  BlogCategoryController.updateCategory
);
router.delete("/delete/:id", checkToken, BlogCategoryController.deleteCategory);
router.post(
  "/delete-post-cat",
  checkToken,
  BlogCategoryController.deletePostCategory
);

module.exports = router;
