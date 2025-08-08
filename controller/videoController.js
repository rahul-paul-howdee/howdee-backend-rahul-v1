const { generateSubtleAnimation } = require("../utils/videoGenerateReplicateUtil");
const { uploadToCloudinary } = require("../utils/cloudinaryUtil");


/**
 * POST /api/generate-professional-video
 * Body: {
 *   imageUrl: string,
 *   prompt?: string
 * }
 */
exports.generateProfessionalVideo = async (req, res) => {
  try {
    const { imageUrl, prompt = "" } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ error: "imageUrl is required" });
    }

    const lowerPrompt = prompt.toLowerCase();
    let animationPrompt;

    if (lowerPrompt.includes("diwali")) {
      animationPrompt = "The person bows down a little toward the camera with eyes closed. If a diya is present, its flame flickers subtly.";
    } else if (lowerPrompt.includes("birthday")) {
      animationPrompt = "The candle flames on the cake flicker. The person leans slightly forward, bringing the cake closer to the screen.";
    } else {
      animationPrompt = "Very subtle eye blinking and slight hair movement, natural facial expression.";
    }

    // 1. Generate the video using Replicate
    const generated = await generateSubtleAnimation(imageUrl, animationPrompt);

    // 2. Upload the generated video URL to Cloudinary
    // We explicitly set the resourceType to 'video' for robustness
    const cloudinaryVideoUrl = await uploadToCloudinary(generated.videoUrl, 'video');

    // 3. Respond with the new Cloudinary URL
    res.json({
      success: true,
      videoUrl: cloudinaryVideoUrl, // Return the permanent Cloudinary URL
      replicateUrl: generated.videoUrl, // You can still return the original for reference
      processingTime: generated.processingTime,
      animationPrompt
    });

  } catch (error) {
    console.error("Professional Video Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      suggestion: error.message.includes('Cloudinary')
        ? "Upload to Cloudinary failed. Check if the Replicate URL is valid and public."
        : "Ensure your image URL is publicly accessible"
    });
  }
};
