const express = require("express");
const router = express.Router();
const CategoryController = require("../../../../../controller/api/v1/student/categories");
router.get("/all", CategoryController.getCategories);

module.exports = router;
