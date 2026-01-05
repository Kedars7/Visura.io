const Asset = require("../models/assetsModel.js");
const storageService = require("../services/storageService.js");
const { v4: uuid } = require("uuid");

// Upload a new asset (subject/logo)
const uploadAsset = async (req, res) => {
  try {
    const { type } = req.body;
    const userId = req.userId; // From auth middleware

    // Validation
    if (!type) {
      return res.status(400).json({
        message: "Type is required",
      });
    }

    // Validate type
    const validTypes = ["subject", "logo", "reference"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        message: "Type must be either 'subject', 'logo', or 'reference'",
      });
    }

    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    // Get file extension from original filename
    const fileExtension = req.file.originalname.split('.').pop();
    const filename = `${uuid()}.${fileExtension}`;

    //Upload image to imagekit
    const fileUploadResult = await storageService.uploadFile(req.file.buffer, filename);


    const newAsset = await Asset.create({
      userId,
      type,
      url : fileUploadResult.url,
      filename,
    });

    res.status(201).json({
      message: "Asset uploaded successfully",
      asset: newAsset,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Get all assets for the authenticated user
const getUserAssets = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware

    const assets = await Asset.find({ userId });

    res.status(200).json({
      message: "Assets fetched successfully",
      assets,
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete an asset
const deleteAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId; // From auth middleware

    const asset = await Asset.findOneAndDelete({ _id: id, userId });

    if (!asset) {
      return res.status(404).json({
        message: "Asset not found",
      });
    }

    res.status(200).json({
      message: "Asset deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  uploadAsset,
  getUserAssets,
  deleteAsset,
};
