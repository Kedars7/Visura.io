const express = require("express");
const { getThumbnailOutputs, getAllThumbnailsForUser } = require("../controllers/thumbnailOutput.js");
const isAuthenticated = require("../middleware/authMiddleware.js");

const router = express.Router();

//Route to get thumbnail outputs for a project
router.route("/:projectId").get(isAuthenticated, getThumbnailOutputs);
router.route("/user/all").get(isAuthenticated, getAllThumbnailsForUser)

module.exports = router;