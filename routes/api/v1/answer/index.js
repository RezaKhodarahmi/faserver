const express = require("express");
const router = express.Router();
const AnswerController = require("../../../../controller/api/v1/answer");
const { checkToken } = require("../../../../utils/verifyAccessToken");

router.get("/:id", checkToken, AnswerController.getAnswers);
router.post("/create", checkToken, AnswerController.createNewAnswer);
router.patch("/update", checkToken, AnswerController.updateAnswer);
router.get("/:id", checkToken, AnswerController.getAnswerWithId);
router.delete("/delete/:id", checkToken, AnswerController.deleteAnswer);

module.exports = router;
