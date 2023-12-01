const express = require("express");
const router = express.Router();
const BlogCategoryController = require("../../../../controller/api/v1/blogcategory");
const { checkToken } = require("../../../../utils/verifyAccessToken");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/blog/categories");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
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
