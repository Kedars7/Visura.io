const express = require("express");
const { getAllStylePresets, createStylePreset,updateStylePreset } = require("../controllers/stylePresetController.js");

const router = express.Router();

// Public route - no authentication required for viewing presets
router.route("/").get(getAllStylePresets);
router.route("/create").post(createStylePreset); 
// Admin only route to create new style preset
router.route("/:id").put(updateStylePreset);
// Admin only route to update style preset
module.exports = router;
