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
      animationPrompt =
        "The person bows down a little toward the camera with eyes closed. If a diya is present, its flame flickers subtly.";
    } else if (lowerPrompt.includes("birthday")) {
      animationPrompt =
        "The candle flames on the cake flicker. The person leans slightly forward, bringing the cake closer to the screen.";
    } else if (lowerPrompt.includes("independence")) {
      animationPrompt =
        "The jets move out of the frame while following the same parallel track that they were on. The subject stands in salute position with head tilting up to look at the sky.";
    } else {
      animationPrompt =
        "Very subtle eye blinking and slight hair movement, natural facial expression.";
    }

    // Generate the video
   const result = await generateSubtleAnimation(imageUrl, animationPrompt);
console.log("📤 Animation generation result:", result);
const { videoUrl, replicateUrl, processingTime } = result;


    res.json({
      success: true,
      videoUrl,       // Cloudinary permanent URL
      replicateUrl,   // Replicate raw output URL
      processingTime, // How long it took
      animationPrompt
    });

  } catch (error) {
    console.error("Professional Video Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      suggestion: error.message.includes("Cloudinary")
        ? "Upload to Cloudinary failed. Check if the Replicate URL is valid and public."
        : "Ensure your image URL is publicly accessible"
    });
  }
};
