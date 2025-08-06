const { generateDiwaliImage } = require("../utils/generateImageReplicateUtil");
// const {generateDiwaliImage} = require("../utils/curlImageGenerate")
const { uploadToCloudinary } = require("../utils/cloudinaryUtil");
const {
  enhancePromptWithOpenAI,
  enhanceDiwaliPromptWithOpenAI,
  enhanceBirthdayPromptWithOpenAI
} = require("../utils/promptEnhancerOpenAiUtil");
const fs = require("fs");


exports.generateDiwaliImage = async (req, res) => {
  let tempFilePath = req.file?.path;

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No selfie image provided" });
    }

    const selfieUrl = await uploadToCloudinary(tempFilePath);
    console.log("Selfie uploaded:", selfieUrl);

    const userPrompt = req.body.prompt || "A person celebrating a festival";
    const lowerPrompt = userPrompt.toLowerCase();

    let enhancedPrompt;

    if (lowerPrompt.includes("diwali")) {
      enhancedPrompt = await enhanceDiwaliPromptWithOpenAI(userPrompt);
    } else if (lowerPrompt.includes("birthday")) {
      enhancedPrompt = await enhanceBirthdayPromptWithOpenAI(userPrompt);
    } else {
      enhancedPrompt = await enhancePromptWithOpenAI(userPrompt);
    }

    console.log("Enhanced Prompt:", enhancedPrompt);

    // const result = await generateDiwaliImage(selfieUrl, enhancedPrompt);
    const result = await generateDiwaliImage(selfieUrl, enhancedPrompt);

    if (!result?.output) {
      throw new Error("Generation completed but no image URL returned");
    }

    res.json({
      success: true,
      selfie: selfieUrl,
      generatedImage: result.output,
      enhancedPrompt,
      status: result.status,
      processingTime: result.metrics?.predict_time
    });

  } catch (error) {
    console.error("Controller Error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      details: process.env.NODE_ENV === "development" ? {
        stack: error.stack,
        response: error.response?.data
      } : undefined
    });
  } finally {
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
};
