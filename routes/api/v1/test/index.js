const express = require("express");
const router = express.Router();
const TestController = require("../../../../controller/api/v1/test");
const { checkToken } = require("../../../../utils/verifyAccessToken");

router.get("/", checkToken, TestController.getTests);
router.post("/create", checkToken, TestController.creteNewTest);
router.patch("/update", checkToken, TestController.updateTest);
router.get("/:id", checkToken, TestController.getTestWithId);
router.delete("/delete/:id", checkToken, TestController.deleteTest);

module.exports = router;
