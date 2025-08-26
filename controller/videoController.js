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
    } else if (lowerPrompt.includes("morning")) {
      animationPrompt =
        "Make the person slowly raise the coffee cup towards the screen, as if offering a sip to the viewer. Then they take a gentle sip themselves, smiling warmly. The rising sun in the background glows brighter for a moment, and a couple of birds fly smoothly across the sky. The “Good Morning” text softly pulses in brightness, giving a fresh and energetic vibe.";
    } else if (lowerPrompt.includes("night")) {
      animationPrompt =
        "Give a very slight animation where the stars in the background twinkle softly, and the moon glows with a faint pulsing light. The subject brings their joined hands above their left shoulder and tilts their head to place their left cheek on the folded hands as if sleeping, while slowly closing their eyes.";
    } else if (lowerPrompt.includes("ganesh")) {
      animationPrompt =
        "Give a very slight animation where the faint golden sparkles drift across, the incense smoke curls upward gently, flowers fall from the left and right. The subject bows down his head gently";
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
