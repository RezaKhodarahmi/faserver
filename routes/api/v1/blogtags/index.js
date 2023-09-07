const express = require("express");
const router = express.Router();
const BlogTagsControler = require("../../../../controller/api/v1/blogtags");
const { checkToken } = require("../../../../utils/verifyAccessToken");

router.get("/", checkToken, BlogTagsControler.getTags);
router.post("/create", checkToken, BlogTagsControler.createTag);
router.get("/:id", checkToken, BlogTagsControler.getTagWithId);
router.patch("/update", checkToken, BlogTagsControler.updateTag);
router.post("/delete/", checkToken, BlogTagsControler.deleteTag);

module.exports = router;
