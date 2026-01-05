const Project = require("../models/projectModel.js");
const StylePreset = require("../models/stylePresentModel.js");
const Asset = require("../models/assetsModel.js");


// Create a new project
const createProject = async (req, res) => {
  try {
    const { title, orientation, inputPrompt, logo, logoPosition, subject, subjectPosition, reference, styleId } = req.body;
    const userId = req.userId; // From auth middleware

    // Validation
    if (!title || !inputPrompt || !orientation || !styleId) {
      return res.status(400).json({
        message: "Title, orientation, input prompt, and style ID are required",
      });
    }

    //upload Assests to cloud if provided

    const newProject = await Project.create({
      userId,
      title,
      orientation,
      inputPrompt,
      logo: logo || null,
      logoPosition: logoPosition || null,
      subject: subject || null,
      subjectPosition: subjectPosition || null,
      reference: reference || null,
      styleId: styleId || null,
      status: "pending",
    });

    res.status(201).json({
      message: "Project created successfully",
      project: newProject,
    });

    
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Get all projects for the authenticated user
const getAllProjects = async (req, res) => {
  try {
    const userId = req.userId; 

    

    const projects = await Project.find({ userId })
      .populate('styleId')
      .populate('logo')
      .populate('subject')
      .populate('reference');

    res.status(200).json({
      message: "Projects retrieved successfully",
      projects,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Get a single project by ID
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId; // From auth middleware

    const project = await Project.findOne({ _id: id, userId })
      .populate("styleId", "name promptTemplate thumbPreview")
      .populate("assets", "type url filename");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json({
      project,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Update a project
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId; // From auth middleware
    const { title, inputPrompt, enhancedPrompt, styleId, assets } = req.body;

    const project = await Project.findOne({ _id: id, userId });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Validate assets array if provided
    if (assets && !Array.isArray(assets)) {
      return res.status(400).json({
        message: "Assets must be an array of asset IDs",
      });
    }

    // Update fields
    if (title) project.title = title;
    if (inputPrompt) project.inputPrompt = inputPrompt;
    if (enhancedPrompt) project.enhancedPrompt = enhancedPrompt;
    if (styleId !== undefined) project.styleId = styleId;
    if (assets) project.assets = assets;
    project.updatedAt = Date.now();

    await project.save();

    res.status(200).json({
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Update project status
const updateProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId; // From auth middleware
    const { status } = req.body;

    // Validate status
    const validStatuses = ["pending", "processing", "complete", "failed"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be: pending, processing, complete, or failed",
      });
    }

    const project = await Project.findOne({ _id: id, userId });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    project.status = status;
    project.updatedAt = Date.now();
    await project.save();

    res.status(200).json({
      message: "Project status updated successfully",
      project,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete a project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId; // From auth middleware

    const project = await Project.findOneAndDelete({ _id: id, userId });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Get projects by status
const getProjectsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const userId = req.userId; // From auth middleware
    const { page = 1, limit = 10 } = req.query;

    // Validate status
    const validStatuses = ["pending", "processing", "complete", "failed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const projects = await Project.find({ userId, status })
      .populate("styleId", "name thumbPreview")
      .populate("assets", "type url filename")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Project.countDocuments({ userId, status });

    res.status(200).json({
      projects,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalProjects: count,
      status,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Add assets to a project
const addAssetsToProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { assetIds } = req.body;

    if (!assetIds || !Array.isArray(assetIds) || assetIds.length === 0) {
      return res.status(400).json({
        message: "Asset IDs array is required",
      });
    }

    const project = await Project.findOne({ _id: id, userId });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Add new assets (avoid duplicates)
    assetIds.forEach((assetId) => {
      if (!project.assets.includes(assetId)) {
        project.assets.push(assetId);
      }
    });

    project.updatedAt = Date.now();
    await project.save();

    // Populate assets before sending response
    await project.populate("assets", "type url filename");

    res.status(200).json({
      message: "Assets added successfully",
      project,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Remove assets from a project
const removeAssetsFromProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { assetIds } = req.body;

    if (!assetIds || !Array.isArray(assetIds) || assetIds.length === 0) {
      return res.status(400).json({
        message: "Asset IDs array is required",
      });
    }

    const project = await Project.findOne({ _id: id, userId });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Remove specified assets
    project.assets = project.assets.filter(
      (assetId) => !assetIds.includes(assetId.toString())
    );

    project.updatedAt = Date.now();
    await project.save();

    // Populate assets before sending response
    await project.populate("assets", "type url filename");

    res.status(200).json({
      message: "Assets removed successfully",
      project,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  updateProjectStatus,
  deleteProject,
  getProjectsByStatus,
  addAssetsToProject,
  removeAssetsFromProject,
};
