const { Inngest } = require("inngest");
const Replicate = require("replicate");
const ImageKit = require("imagekit");
const https = require("https");
const replicate = new Replicate();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

// Initialize ImageKit with credentials
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const inngest = new Inngest({ id: "visura.io" });

//function for enhancing prompt
const enhancePrompt = inngest.createFunction(
  { id: "enhance-prompt" },
  { event: "ai/enhance.prompt" },
  async ({ event, step }) => {
    const { prompt } = event.data;

    if (!prompt) {
      return { error: "Prompt is required" };
    }

    const enhancedPrompt = await step.run("enhance-with-gemini", async () => {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const systemPrompt = `You are a world-class generative AI prompt engineer specializing in creating detailed, cinematic prompts for thumbnail generation. 
Your goal is to enhance user-written prompts while preserving their intent. 
Make the result visually rich, well-composed, and ready for AI image generation.
Include subject details, lighting, mood, background, and composition cues.
Avoid unrelated additions, unnecessary words, or meta text.
Output only the final enhanced prompt in natural descriptive English, no extra commentary.

User Prompt: ${prompt}`;

        const result = await model.generateContent(systemPrompt);
        const response = result.response;
        const text = response.text();

        return text;
      } catch (error) {
        throw error;
      }
    });

    return { enhancedPrompt };
  }
);

//function to generate the image
const generateImage = inngest.createFunction(
  { id: "generate-image" },
  { event: "ai/generate.image" },
  async ({ event, step }) => {
    const { projectId } = event.data;

    //Fetch project details
    const project = await step.run("fetch-project", async () => {
      // Ensure database connection
      const connectDB = require("../config/database.js");
      await connectDB();
      
      // Load all models that will be populated
      const Project = require("../models/projectModel.js");
      const StylePreset = require("../models/stylePresentModel.js");
      const Asset = require("../models/assetsModel.js");

      const proj = await Project.findById(projectId)
        .populate("styleId")
        .populate("logo")
        .populate("subject")
        .populate("reference");

      if (!proj) {
        throw new Error("Project not found");
      }

      return proj;
    });

    //If reference image is present then get prompt for that
    let referenceImgPrompt = "";
    if (project.reference) {
      referenceImgPrompt = await step.run(
        "reference-image-prompt",
        async () => {
          const referenceImg = project.reference.url;

          // Download the image and convert to base64
          const imageBuffer = await new Promise((resolve, reject) => {
            https.get(referenceImg, (response) => {
              const chunks = [];
              response.on("data", (chunk) => chunks.push(chunk));
              response.on("end", () => resolve(Buffer.concat(chunks)));
              response.on("error", reject);
            }).on("error", reject);
          });
          
          const base64Image = imageBuffer.toString("base64");

          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Analyze the provided thumbnail and infer the creative intent behind it. Describe what overall style the creator is aiming for, rather than detailing what is literally visible. Focus on the artistic direction, recurring aesthetic approach, layout logic, emotional tone, and visual identity that the creator would likely want to replicate in future thumbnails.

Return a short and reusable style prompt that captures:
- Lighting mood and aesthetic intention
- Type of composition they strive for
- How subjects should ideally be framed
- Typical text placement approach
- The visual tone or theme they seem to aim for
- Recurrent visual identity choices (if any)

Avoid describing literal objects or exact scene details. 
Do not describe what items, vehicles, people, landscapes, or colors are physically present. 
Instead, express what style the creator is trying to convey and how the thumbnail is supposed to feel or communicate visually.

Output only the final interpreted style prompt, without saying that you analyzed the image.
`,
                  },
                  {
                    inlineData: {
                      mimeType: "image/jpeg",
                      data: base64Image,
                    },
                  },
                ],
              },
            ],
          });

          return response.candidates?.[0]?.content?.parts?.[0]?.text || "";
        }
      );
    }

//     //Image generation function
//     const outputUrl = await step.run("generate-thumbnail-image", async () => {

//       //add the project orientation in ratio form
//       const orientationRatio = project.orientation === "landscape" ? "16:9" : "9:16";

//       const styleLine = project.reference
//         ? `Style to follow (based on reference thumbnail style):\n${referenceImgPrompt}\n`
//         : "";

//       //prompt for image generation
//       const finalPrompt = `
// Generate an ultra high-quality, photo-realistic thumbnail image for a YouTube or social media video.

// Context:
// - Video Title: ${project.title}
// - Visual Concept: ${project.inputPrompt}
// - Theme: ${project.styleId.promptTemplate}
// - Orientation: ${orientationRatio}

// ${styleLine}
// Design Requirements:
// - Ultra realistic, highly detailed, professional thumbnail aesthetic
// - Strong, clear focus on the main subject
// - Clean composition with visual hierarchy and good spacing
// - Leave clear space for short, bold text derived from the video title
// - If logo is provided, place it at the ${project.logoPosition} corner
// - If subject image is provided, integrate it naturally at the ${project.subjectPosition}
// - Use cinematic lighting, sharp focus, crisp contrast, and rich colors
// - Ensure text is large, bold, and easily readable at small sizes
// - Make the image strictly in the given orientation (${orientationRatio})

// Avoid:
// - Blurry, noisy, or low-resolution areas
// - Distorted anatomy, especially faces or hands
// - Overcrowded layouts, chaotic backgrounds, or tiny unreadable text
// - Watermarks, random logos, or UI elements
// `;

//       //Image generation logic here
//       const input = {
//         prompt: finalPrompt,
//         image_input: [
//           project.logo?.url,
//           project.subject?.url,
//         ].filter(Boolean),
//       };

//       //call replicate to generate image
//       const output = await replicate.run("google/nano-banana", { input });

//       return output.url();
//     });

//     //Upload image to imagekit function
//     const imagekitUrl = await step.run("upload-to-imagekit", async () => {
//       const imageRef = await imagekit.upload({
//         file: outputUrl,
//         fileName: `project_${projectId}_generated_image.jpg`,
//         isPublished: true,
//         useUniqueFileName: false,
//       });

//       return imageRef.url;
//     });

//For testing purpose
const imagekitUrl = "https://ik.imagekit.io/kedars7/project_693597ed78e18eaffa988882_generated_image.jpg?updatedAt=1765120075264"

    //Store thumbnail URL in project
    await step.run("store-thumbnail-url", async () => {
      // Ensure database connection
      const connectDB = require("../config/database.js");
      await connectDB();
      
      const resultDB = require("../models/generationModel.js");
      await resultDB.create({
        projectId: projectId,
        userId: project.userId,
        title: project.title,
        url: imagekitUrl,
        resolution: project.orientation
      })

    })


//For testing purpose
await step.sleep("wait-a-moment", "5s");

    //return thumnail url on imagekit
    return { outputUrl: imagekitUrl };
  }
);

const functions = [ enhancePrompt, generateImage];

module.exports = { inngest, functions };
