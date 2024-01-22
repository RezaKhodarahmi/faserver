const express = require("express");
const router = express.Router();
const ProfileController = require("../../../../../controller/api/v1/student/profile/");
const { checkToken } = require("../../../../../utils/verifyAccessToken");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/users");
  },
  filename: function (req, file, cb) {
    // Generate a unique file name with the original extension
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
router.get("/:email", checkToken, ProfileController.profileInfo);
router.post("/courses", checkToken, ProfileController.getCourses);
router.post("/auto-renewal", checkToken, ProfileController.autoRenewal);
router.patch(
  "/update",
  checkToken,
  upload.single("avatar"),
  ProfileController.updateUserData
);
router.patch("/resetpassword", checkToken, ProfileController.resetpassword);

module.exports = router;
