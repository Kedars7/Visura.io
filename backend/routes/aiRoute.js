const express = require("express");
const isAuthenticated = require("../middleware/authMiddleware.js");
const { inngest } = require("../inngest/index.js");
const { enhancePrompt } = require("../controllers/aiController.js");

const router = express.Router();

//route for enhancing prompt in inngest
// router.post("/enhance-prompt", isAuthenticated, async (req, res) => {
//     try {
//         const { prompt } = req.body;

//         if(!prompt) {
//             return res.status(400).json({ error: "Prompt is required" });
//         }

//         //send event to inngest
//         await inngest.send({
//             name: "ai/enhance.prompt",
//             data: {
//                 prompt,
//                 userId: req.user?.id,
//             },
//         });

//         res.status(200).json({
        
//         });
//     } catch (error) {
//         res.status(500).json({ error: "Internal server error" });
//     }
// })

//direct routing from controller
router.post("/enhance-prompt", isAuthenticated, enhancePrompt)

//generate image
router.post("/generate-image", isAuthenticated, async (req, res) => {
    try {
        const { projectId } = req.body;

        if(!projectId) {
            return res.status(400).json({ error: "Project ID is required" });
        }

        //send event to inngest and get response
        const response = await inngest.send({
            name: "ai/generate.image",
            data: {
                projectId,
                userId: req.user?.id,
            },
        });

        res.status(200).json({
            message: "Image generation started",
            data: response,
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
})

module.exports = router;