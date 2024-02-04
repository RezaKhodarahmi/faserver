const express = require("express");
const router = express.Router();
const WebinarController = require("../../../../controller/api/v1/webinar");
const { checkToken } = require("../../../../utils/verifyAccessToken");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/webinars");
  },
  filename: function (req, file, cb) {
    // Generate a unique file name with the original extension
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.get("/", checkToken, WebinarController.getWebinars);
router.post(
  "/create",
  checkToken,
  upload.single("image"),
  WebinarController.createWebinar
);
router.get("/:id", checkToken, WebinarController.getWebinarWithId);

router.patch(
  "/update/",
  checkToken,
  upload.single("image"),

  WebinarController.updateWebinar
);

router.delete("/delete/:id", checkToken, WebinarController.deleteWebinar);

module.exports = router;
