const express = require("express");
const router = express.Router();
const WebinarController = require("../../../../../controller/api/v1/student/webinar");
const { checkToken } = require("../../../../../utils/verifyAccessToken");

router.get("/", WebinarController.getWebinars);
router.post("/single", WebinarController.getSingleWebinar);
router.post("/enroll", checkToken, WebinarController.enrollUser);

module.exports = router;
