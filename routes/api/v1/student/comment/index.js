const express = require("express");
const router = express.Router();
const CommentController = require("../../../../../controller/api/v1/student/comment/");
const { checkToken } = require("../../../../../utils/verifyAccessToken");

router.post("/create", CommentController.createComment);

module.exports = router;
