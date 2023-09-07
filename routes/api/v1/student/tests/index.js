const express = require("express");
const controller = require("../../../../../controller/api/v1/student/tests");
const router = express.Router();
const { checkToken } = require("../../../../../utils/verifyAccessToken");

router.get("/:slug", controller.getTests);

module.exports = router;
