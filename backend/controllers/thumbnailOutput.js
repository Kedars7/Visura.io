const { get } = require("mongoose");
const ProjectOp = require("../models/generationModel.js");
const Project = require("../models/projectModel.js")

//Get thumbnail outputs for a project
const getThumbnailOutputs = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.userId;

        if(!projectId) {
            return res.status(400).json({ error: "Project ID is required" });
        }

        //Verify project belongs to user
        const project = await Project.findOne({ _id: projectId, userId });
        if(!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        //Fetch generation results
        const results = await ProjectOp.find({ projectId });

        res.status(200).json({
            message: "Thumbnail outputs retrieved successfully",
            data: results,
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

//Get all thumbnails for a user
const getAllThumbnailsForUser = async (req, res) => {
    try{
        const userId = req.userId;

        //Fetch all projects output for the user
        const allProjects = await ProjectOp.find({ userId });
        res.status(200).json({
            message: "All thumbnail outputs retrieved successfully",
            data: allProjects,
        });
    }
    catch(error){
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { getThumbnailOutputs, getAllThumbnailsForUser };