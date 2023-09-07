const express = require("express");
const router = express.Router();
const AnswerControler = require("../../../../controller/api/v1/answer");
const { checkToken } = require("../../../../utils/verifyAccessToken");

router.get("/:id", checkToken, AnswerControler.getAnswers);
router.post("/create", checkToken, AnswerControler.createNewAnswer);
router.patch("/update", checkToken, AnswerControler.updateAnswer);
router.get("/:id", checkToken, AnswerControler.getAnswerWithId);
router.delete("/delete/:id", checkToken, AnswerControler.deleteAnswer);

module.exports = router;
