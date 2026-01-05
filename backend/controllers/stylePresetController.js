const StylePreset = require("../models/stylePresentModel.js");

// Get all style presets
const getAllStylePresets = async (req, res) => {
  try {
    const stylePresets = await StylePreset.find().sort({ name: 1 });

    res.status(200).json({
      presets: stylePresets,
      totalPresets: stylePresets.length,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};


//Create new style only for admin use
const createStylePreset = async (req, res) => {
  try {
    const { name, promptTemplate, color, icon } = req.body;

    // Create new style preset
    const newStylePreset = new StylePreset({
      name,
      promptTemplate,
      color,
      icon,
    });

    await newStylePreset.save();

    res.status(201).json({ message: "Style preset created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

//update style preset - admin only
const updateStylePreset = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, promptTemplate, color, icon } = req.body;

    const updatedStylePreset = await StylePreset.findByIdAndUpdate(
      id,
      { name, promptTemplate, color, icon },
      { new: true }
    );

    if (!updatedStylePreset) {
      return res.status(404).json({ message: "Style preset not found" });
    }

    res.status(200).json({ message: "Style preset updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllStylePresets,
  createStylePreset,
  updateStylePreset,
};
