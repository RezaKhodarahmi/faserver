const express = require("express");
const router = express.Router();
const CategoryController = require("../../../../controller/api/v1/categories");
const { checkToken } = require("../../../../utils/verifyAccessToken");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/categories");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});
const upload = multer({ storage: storage });
router.get("/", checkToken, CategoryController.getCategories);
router.post(
  "/create",
  checkToken,
  upload.single("image"),
  CategoryController.createCategory
);
router.get("/:id", checkToken, CategoryController.getCategoryWithId);
router.patch(
  "/update",
  checkToken,
  upload.single("image"),
  CategoryController.updateCategory
);
router.delete("/delete/:id", checkToken, CategoryController.deleteCategory);

module.exports = router;
