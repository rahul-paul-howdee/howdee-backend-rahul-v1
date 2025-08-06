const { generateSubtleAnimation } = require("../utils/videoGenerateReplicateUtil");

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

    const generated = await generateSubtleAnimation(imageUrl, animationPrompt);

    res.json({
      success: true,
      videoUrl: generated.videoUrl,
      processingTime: generated.processingTime,
      animationPrompt
    });

  } catch (error) {
    console.error("Professional Video Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      suggestion: error.message.includes('Cloudinary')
        ? "Try reducing text size or using simpler fonts"
        : "Ensure your image URL is publicly accessible"
    });
  }
};
