const express = require("express");
const router = express.Router();
const QuestionController = require("../../../../controller/api/v1/question");
const { checkToken } = require("../../../../utils/verifyAccessToken");

router.get("/", checkToken, QuestionController.getQuestions);
router.post("/create", checkToken, QuestionController.creteNewQuestion);
router.patch("/update", checkToken, QuestionController.updateQuestion);
router.get("/:id", checkToken, QuestionController.getQuestionWithId);
router.post("/delete/", checkToken, QuestionController.deleteQuestion);

module.exports = router;
