const express = require("express");
const router = express.Router();
const BlogCategoryControler = require("../../../../controller/api/v1/blogcategory");
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
router.get("/", checkToken, BlogCategoryControler.getCategories);
router.post(
  "/create",
  checkToken,
  upload.single("image"),
  BlogCategoryControler.createCategory
);
router.get("/:id", BlogCategoryControler.getCategoryWithId);
router.patch(
  "/update",
  checkToken,
  upload.single("image"),
  BlogCategoryControler.updateCategory
);
router.delete("/delete/:id", checkToken, BlogCategoryControler.deleteCategory);
router.post(
  "/delete-post-cat",
  checkToken,
  BlogCategoryControler.deletePostCategory
);

module.exports = router;
