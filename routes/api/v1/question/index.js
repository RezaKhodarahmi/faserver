const express = require("express");
const router = express.Router();
const questionControler = require("../../../../controller/api/v1/question");
const { checkToken } = require("../../../../utils/verifyAccessToken");

router.get("/", checkToken, questionControler.getQuestions);
router.post("/create", checkToken, questionControler.creteNewQuestion);
router.patch("/update", checkToken, questionControler.updateQuestion);
router.get("/:id", checkToken, questionControler.getQuestionWithId);
router.post("/delete/", checkToken, questionControler.deleteQuestion);

module.exports = router;
