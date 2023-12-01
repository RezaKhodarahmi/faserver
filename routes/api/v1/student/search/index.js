const express = require("express");
const router = express.Router();
const SearchController = require("../../../../../controller/api/v1/student/search");

router.get("/:searchTerm", SearchController.searchCourse);

module.exports = router;
