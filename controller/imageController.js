const { generateDiwaliImage } = require("../utils/generateImageReplicateUtil");
const { swapFace } = require("../utils/swapFaceUtil"); // new util
const { uploadToCloudinary } = require("../utils/cloudinaryUtil");
const {
  enhancePromptWithOpenAI,
  enhanceDiwaliPromptWithOpenAI,
  enhanceBirthdayPromptWithOpenAI,
  hardCodeIndependencePrompt,
  HardCodeGoodNightPrompt,
  HardCodeGoodMorningPrompt,
  HardCodeGaneshChaturthiPrompt
} = require("../utils/promptEnhancerOpenAiUtil");
const fs = require("fs");

exports.generateDiwaliImage = async (req, res) => {
  let tempFilePath = req.file?.path;

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No selfie image provided" });
    }

    // Upload selfie image
    const selfieUrl = await uploadToCloudinary(tempFilePath);
    console.log("✅ Selfie uploaded:", selfieUrl);

    const userPrompt = req.body.prompt || "A person celebrating a festival";
    const lowerPrompt = userPrompt.toLowerCase();

    let enhancedPrompt;

    if (lowerPrompt.includes("diwali")) {
      enhancedPrompt = await enhanceDiwaliPromptWithOpenAI(userPrompt);
    } else if (lowerPrompt.includes("birthday")) {
      enhancedPrompt = await enhanceBirthdayPromptWithOpenAI(userPrompt);
    } else if (lowerPrompt.includes("independence")) {
      enhancedPrompt = await hardCodeIndependencePrompt(userPrompt);
    } else if (lowerPrompt.includes("morning")) {
      enhancedPrompt = await HardCodeGoodMorningPrompt(userPrompt);
    } else if (lowerPrompt.includes("night")) {
      enhancedPrompt = await HardCodeGoodNightPrompt(userPrompt);
    } else if (lowerPrompt.includes("ganesh")) {
      enhancedPrompt = await HardCodeGaneshChaturthiPrompt(userPrompt);
    }else {
      enhancedPrompt = await enhancePromptWithOpenAI(userPrompt);
    }

    console.log("✨ Enhanced Prompt:", enhancedPrompt);

    // Generate creative image based on prompt (target image)
    const result = await generateDiwaliImage(selfieUrl, enhancedPrompt);

    if (!result?.output) {
      throw new Error("Image generation completed but no image URL returned");
    }

    const generatedImageUrl = result.output;
    console.log("🎨 Generated Image URL:", generatedImageUrl);

    // CORRECTED: Face swap - extract face from generated image, put into selfie
    // source = generated image (face to extract), target = selfie (where to put the face)
    const swappedImageUrl = await swapFace(generatedImageUrl, selfieUrl);
    console.log("🤖 Swapped Image URL:", swappedImageUrl);

    res.json({
      success: true,
      selfie: selfieUrl,
      withoutSwap: generatedImageUrl,
      generatedImage: swappedImageUrl,
      swappedImage: swappedImageUrl,
      enhancedPrompt,
      status: result.status,
      processingTime: result.metrics?.predict_time
    });

  } catch (error) {
    console.error("❌ Controller Error:", error.message);
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
