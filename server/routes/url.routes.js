const express = require("express");
const router = express.Router();
const urlController = require("../controllers/url.controller");
const auth = require("../middleware/auth");

router.post("/shorten", auth, urlController.createShortUrl);
router.get("/all", auth, urlController.getAllUrls);
router.get("/analytics/:shortId", auth, urlController.getAnalytics);
router.get("/:shortId", urlController.redirectToUrl);
router.patch("/url/toggle/:shortId", auth, urlController.toggleUrlStatus);

module.exports = router;
