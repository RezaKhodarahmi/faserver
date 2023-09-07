const express = require("express");
const router = express.Router();
const VideoController = require("../../../../controller/api/v1/videos");
const { checkToken } = require("../../../../utils/verifyAccessToken");

router.get("/", checkToken, VideoController.getVideos);
router.post("/create", checkToken, VideoController.creteNewVideo);
router.patch("/update", checkToken, VideoController.updateVideo);
router.get("/:id", checkToken, VideoController.getVideoWithId);
router.delete("/delete/:id", checkToken, VideoController.deleteVideo);

module.exports = router;
