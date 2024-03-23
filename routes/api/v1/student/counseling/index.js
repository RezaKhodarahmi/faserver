const express = require("express");
const router = express.Router();
const CounselingController = require("../../../../../controller/api/v1/student/counseling");
const { checkToken } = require("../../../../../utils/verifyAccessToken");

router.post("/create", checkToken, CounselingController.createNewCounseling);
router.get("/times/:date", CounselingController.getFreeTimes);

module.exports = router;
