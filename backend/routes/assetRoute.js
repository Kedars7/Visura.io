const express = require("express");
const {
  uploadAsset,
  getUserAssets,
  deleteAsset,
} = require("../controllers/assetController.js");
const isAuthenticated = require("../middleware/authMiddleware.js");
const multer = require("multer");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File is too large. Maximum size is 10MB',
      });
    }
    return res.status(400).json({
      message: `Upload error: ${err.message}`,
    });
  } else if (err) {
    return res.status(400).json({
      message: err.message || 'File upload failed',
    });
  }
  next();
};

// All routes are protected with authentication middleware
router.route("/").post(isAuthenticated, upload.single("image"), handleMulterError, uploadAsset);
router.route("/").get(isAuthenticated, getUserAssets);
router.route("/:id").delete(isAuthenticated, deleteAsset);

module.exports = router;
