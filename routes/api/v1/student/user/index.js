const express = require("express");
const controller = require("../../../../../controller/api/v1/student/user");
const router = express.Router();
const { checkToken } = require("../../../../../utils/verifyAccessToken");

router.post("/register", controller.handelRegister);
router.post("/register/verify", controller.HandleTokenValidation);
router.post("/register/info", controller.HandlePersonalInfo);
router.patch("/update", checkToken, controller.HandleUserUpdate);
router.get("/:email", checkToken, controller.getUserWithEmail);
router.get("/vip/:email", checkToken, controller.getUserVipInfo);

module.exports = router;
