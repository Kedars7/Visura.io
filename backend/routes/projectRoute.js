const express = require("express");
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  updateProjectStatus,
  deleteProject,
  getProjectsByStatus,
  addAssetsToProject,
  removeAssetsFromProject,
} = require("../controllers/projectController.js");
const isAuthenticated = require("../middleware/authMiddleware.js");

const router = express.Router();

// All routes are protected with authentication middleware
router.route("/").post(isAuthenticated, createProject);
router.route("/").get(isAuthenticated, getAllProjects);
router.route("/:id").get(isAuthenticated, getProjectById);
router.route("/:id").put(isAuthenticated, updateProject);
router.route("/:id/status").patch(isAuthenticated, updateProjectStatus);
router.route("/:id").delete(isAuthenticated, deleteProject);
router.route("/status/:status").get(isAuthenticated, getProjectsByStatus);
router.route("/:id/assets/add").patch(isAuthenticated, addAssetsToProject);
router.route("/:id/assets/remove").patch(isAuthenticated, removeAssetsFromProject);

module.exports = router;
