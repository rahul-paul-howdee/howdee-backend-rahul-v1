const axios = require("axios");
const fs = require("fs");
const path = require("path");
const tmp = require("tmp");
const { generateDiwaliImage } = require("../utils/generateImageReplicateUtil");
const { uploadToCloudinary } = require("../utils/cloudinaryUtil");
const {
  enhancePromptWithOpenAI,
  enhanceDiwaliPromptWithOpenAI,
  enhanceBirthdayPromptWithOpenAI
} = require("../utils/promptEnhancerOpenAiUtil");

exports.generateDiwaliImage = async (req, res) => {
  let tempFilePath = req.file?.path;

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No selfie image provided" });
    }

    // 1. Upload selfie to Cloudinary
    const selfieUrl = await uploadToCloudinary(tempFilePath, "howdee-mvp-v1");
    console.log("Selfie uploaded:", selfieUrl);

    // 2. Enhance the prompt
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

    // 3. Generate image from Replicate
    const result = await generateDiwaliImage(selfieUrl, enhancedPrompt);
    if (!result?.output) {
      throw new Error("Generation completed but no image URL returned");
    }

    // 4. Download generated image to temp file
    const imageResponse = await axios.get(result.output, { responseType: "stream" });
    const tmpFile = tmp.fileSync({ postfix: ".png" });
    const writer = fs.createWriteStream(tmpFile.name);
    imageResponse.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    // 5. Upload generated image to Cloudinary (howdee-mvp-v1 folder)
    const generatedImageUrl = await uploadToCloudinary(tmpFile.name, "howdee-mvp-v1");

    // 6. Respond with both URLs
    res.json({
      success: true,
      selfie: selfieUrl,
      generatedImage: generatedImageUrl,
      enhancedPrompt,
      status: result.status,
      processingTime: result.metrics?.predict_time
    });

    // 7. Cleanup
    tmpFile.removeCallback();

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
