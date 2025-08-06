const Replicate = require("replicate");
const cloudinary = require('cloudinary').v2;
require("dotenv").config();
const axios = require("axios");
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  timeout: 60000
});

const SEEDANCE_MODEL = "bytedance/seedance-1-pro:fb4b92e4be45c1ea50c94e71ff51ffd88fd6327e2c55efb431a9d88afdfaeb86";

/**
 * Generates subtle animation from image using Replicate
 * @param {string} imageUrl - Publicly accessible image URL
 * @param {string} prompt - Animation instructions
 * @returns {Promise<Object>} - { videoUrl, processingTime }
 */
exports.generateSubtleAnimation = async (imageUrl, prompt) => {
  try {
    // Verify image exists
    await validateImageUrl(imageUrl);

    const input = {
      image: imageUrl,
      prompt: `${prompt}. Very subtle natural movements. Maintain perfect facial likeness.`,
      duration: 5,
      resolution: "480p", // Lower resolution for better success rate
      aspect_ratio: "1:1",
      fps: 24,
      camera_fixed: true,
      seed: Math.floor(Math.random() * 1000000)
    };
        console.log("generating professional video with using bytedance/seedance-1-pro")


    const prediction = await replicate.predictions.create({
      version: SEEDANCE_MODEL.split(":")[1],
      input: input
    });

    const result = await waitForCompletion(prediction.id);
    
    if (!result.output) {
      throw new Error("Video generation failed - no output URL");
    }

    return {
      videoUrl: result.output,
      processingTime: result.metrics?.predict_time
    };
  } catch (error) {
    console.error("Animation Generation Error:", error);
    throw new Error(`Animation generation failed: ${error.message}`);
  }
};

/**
 * Adds professional text overlay to video using Cloudinary
 * @param {string} videoUrl - Input video URL
 * @param {Object} textOptions - Text configuration
 * @returns {Promise<string>} - URL of processed video
 */
exports.addTextOverlayToVideo = async (videoUrl, textOptions) => {
  try {
    const result = await cloudinary.uploader.upload(videoUrl, {
      resource_type: "video",
      transformation: [
        {
          overlay: {
            font_family: textOptions.font,
            font_size: textOptions.titleSize,
            font_weight: "bold",
            text: `${textOptions.title}\n${textOptions.subtitle}`
          },
          color: textOptions.color,
          gravity: "north",
          y: 50,
          effect: "shadow:10"
        }
      ]
    });

    return result.secure_url;
  } catch (error) {
    console.error("Text Overlay Error:", error);
    throw new Error(`Failed to add text overlay: ${error.message}`);
  }
};

// Helper Functions

async function validateImageUrl(url) {
  try {
    const response = await axios.head(url);
    if (response.status !== 200) {
      throw new Error(`Image URL returned status ${response.status}`);
    }
  } catch (error) {
    throw new Error(`Invalid image URL: ${error.message}`);
  }
}

async function waitForCompletion(predictionId, timeout = 180000) {
  const start = Date.now();
  let prediction;

  while (Date.now() - start < timeout) {
    prediction = await replicate.predictions.get(predictionId);
    
    if (prediction.status === "succeeded") return prediction;
    if (prediction.status === "failed") {
      throw new Error(prediction.error || "Prediction failed");
    }
    
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  throw new Error(`Timeout after ${timeout/1000} seconds`);
}