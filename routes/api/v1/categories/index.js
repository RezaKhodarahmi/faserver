const express = require("express");
const router = express.Router();
const CategoryController = require("../../../../controller/api/v1/categories");
const { checkToken } = require("../../../../utils/verifyAccessToken");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/categories");
  },
  filename: function (req, file, cb) {
    // Generate a unique file name with the original extension
    cb(null, uuidv4() + path.extname(file.originalname));
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
