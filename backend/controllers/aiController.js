import fs from "fs";
import Project from "../models/projectModel.js";
import Replicate from "replicate";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

const replicate = new Replicate();

//prompt enhancer
const enhancePrompt = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    // Integrate with gemini ai model here
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are a world-class generative AI prompt engineer specializing in creating detailed, cinematic prompts for thumbnail generation. 
Your goal is to enhance user-written prompts while preserving their intent. 
Make the result visually rich, well-composed, and ready for AI image generation.
Include subject details, lighting, mood, background, and composition cues.
Avoid unrelated additions, unnecessary words, or meta text.
Output only the final enhanced prompt in natural descriptive English, no extra commentary.

User Prompt: ${prompt}`,
            },
          ],
        },
      ],
    });

    const enhancedPrompt =
      response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return res.status(200).json({ enhancedPrompt });
  } catch (error) {
    
    // Handle quota/rate limit errors from API
    if (error.status === 429) {
      return res.status(429).json({ 
        message: "AI service quota exceeded. Please try again later.",
        error: "QUOTA_EXCEEDED",
        retryAfter: 10
      });
    }
    
    return res.status(500).json({ message: "Server error" });
  }
};



//generating image from project details
const generateImage = async (req, res) => {
  try {
    const { id } = req.body;

    const project = await Project.findById(id).populate("styleId").populate("logo").populate("subject").populate("reference");

    if (!project || !project.inputPrompt) {
      return res
        .status(400) 
        .json({ message: "Project with valid input prompt is required" });
    }

    const finalPrompt = `
Generate a high-quality thumbnail image for a YouTube or social media video.

Context:
- Video Title: ${project.title}
- Visual Concept: ${project.inputPrompt}
- Theme: ${project.styleId.promptTemplate}
- Orientation: ${project.orientation}

Design Requirements:
- Maintain a clean composition with large visual focus on the main subject
- Leave space for text derived from the video title
- If logo is provided, place it at ${project.logoPosition} corner
- If subject image is provided, include it naturally at ${project.subjectPosition}
- Reference the overall style and lighting from the given reference image if provided
- Cinematic lighting, crisp contrast, 4K quality, bold readability, high energy, professional thumbnail aesthetic.

Avoid:
- Blurry details, distorted subjects, unreadable text, watermarks, messy backgrounds  
    `;

    const input = {
      prompt: finalPrompt,
      aspect_ratio: project.orientation === "landscape" ? "16:9" : "9:16"
    }

    //use replicate to generate image
    const output = await replicate.run("google/imagen-4-fast", { input });

    // To access the file URL:

    return res.status(200).json({ prompt: finalPrompt });


  } catch (error) {
    
    // Handle quota/rate limit errors from API
    if (error.status === 429) {
      const retryAfter = error.details?.find(d => d['@type']?.includes('RetryInfo'))?.retryDelay;
      const retrySeconds = retryAfter ? parseInt(retryAfter.replace('s', '')) : 60;
      
      return res.status(429).json({ 
        message: "AI service quota exceeded. The free tier has daily/hourly limits. Please try again later or upgrade your plan.",
        error: "QUOTA_EXCEEDED",
        retryAfter: retrySeconds,
        helpUrl: "https://ai.google.dev/pricing"
      });
    }
    
    return res.status(500).json({ message: "Server error" });
  }
};

export {
  enhancePrompt,
  generateImage,
};
