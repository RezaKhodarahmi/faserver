const express = require("express");
const router = express.Router();
const stripController = require("../../../../controller/api/v1/stripe");

router.post("/", stripController.verifyPayment);
router.get("/test",(req,res)=>{

console.log(req)
return res.send("ok")
})
module.exports = router;
