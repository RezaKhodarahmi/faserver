const express = require("express");
const router = express.Router();
const BlogTagsController = require("../../../../controller/api/v1/blogtags");
const { checkToken } = require("../../../../utils/verifyAccessToken");

router.get("/", checkToken, BlogTagsController.getTags);
router.post("/create", checkToken, BlogTagsController.createTag);
router.get("/:id", checkToken, BlogTagsController.getTagWithId);
router.patch("/update", checkToken, BlogTagsController.updateTag);
router.post("/delete/", checkToken, BlogTagsController.deleteTag);

module.exports = router;
