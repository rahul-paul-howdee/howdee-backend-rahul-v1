const Replicate = require("replicate");
const cloudinary = require("cloudinary").v2;
const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// --- Import your utility functions ---
// Assuming these files exist in the specified paths
const { addHowdeeWatermark } = require("../utils/addWatermarkUtil");
const { uploadToCloudinary } = require("../utils/cloudinaryUtil");
const { mergeVideoWithAudio } = require("../utils/addMusicToVideoUtil"); // <-- IMPORT THE NEW MERGE FUNCTION

// --- Cloudinary Configuration ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// --- Replicate Client Initialization ---
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  timeout: 60000 // Setting a 60-second timeout for requests
});

const SEEDANCE_MODEL =
  "bytedance/seedance-1-pro:fb4b92e4be45c1ea50c94e71ff51ffd88fd6327e2c55efb431a9d88afdfaeb86";

/**
 * Generates subtle animation from an image,
 * merges it with audio,
 * adds a watermark,
 * and uploads the final video to Cloudinary.
 * @param {string} imageUrl - The public URL of the source image.
 * @param {string} prompt - The prompt to guide the video generation.
 * @returns {Promise<object>} - An object containing the final Cloudinary URL, the original Replicate URL, and processing time.
 */
exports.generateSubtleAnimation = async (imageUrl, prompt) => {
  const startTime = Date.now();

  try {
    // 1. Validate the source image URL
    await validateImageUrl(imageUrl);

    // 2. Generate the initial silent video using the Seedance model
    console.log("🎥 Generating silent video with Seedance...");
    const prediction = await replicate.predictions.create({
      version: SEEDANCE_MODEL,
      input: {
        image: imageUrl,
        prompt: `${prompt}. Very subtle smile with pride in eyes and moving toward the screen. Maintain perfect facial likeness.`,
        duration: 5,
        resolution: "480p",
        aspect_ratio: "1:1",
        fps: 24,
        camera_fixed: true,
        seed: Math.floor(Math.random() * 1_000_000)
      }
    });

    const result = await waitForCompletion(prediction.id);
    if (!result?.output?.length) {
      throw new Error("Video generation failed - no output URL from Seedance");
    }

    const generatedVideoUrl = Array.isArray(result.output)
      ? result.output[0]
      : result.output;
    console.log("✅ Generated silent video:", generatedVideoUrl);

    // 3. Merge the generated video with the hardcoded audio file
    console.log("🎵 Merging video with audio...");
    const audioMergedUrl = await mergeVideoWithAudio(generatedVideoUrl);
    console.log("✅ Audio merged video URL:", audioMergedUrl);

    // 4. Add a watermark to the audio-merged video
    console.log("💧 Adding watermark...");
    const watermarkedUrl = await addHowdeeWatermark(audioMergedUrl);
    console.log("✅ Watermarked video URL:", watermarkedUrl);

    // 5. Upload the final, watermarked video to Cloudinary
    console.log("☁️ Uploading to Cloudinary...");
    const cloudinaryUrl = await uploadToCloudinary(watermarkedUrl, "video");
    console.log("✅ Final Cloudinary video URL:", cloudinaryUrl);

    // Return all relevant data
    return {
      videoUrl: cloudinaryUrl, // The final URL for the user
      replicateUrl: generatedVideoUrl, // The original silent video for reference
      processingTime: `${((Date.now() - startTime) / 1000).toFixed(1)}s`
    };
  } catch (error) {
    console.error("❌ Animation Generation Error:", error);
    throw new Error(`Animation generation failed: ${error.message}`);
  }
};


// --- Helper Functions (Unchanged) ---

/**
 * Validates that the provided image URL is reachable by sending a HEAD request.
 * @param {string} url - The URL to validate.
 */
async function validateImageUrl(url) {
  try {
    const response = await axios.head(url);
    if (response.status !== 200) {
      throw new Error(`Image URL returned status ${response.status}`);
    }
  } catch (error) {
    throw new Error(`Invalid or unreachable image URL: ${error.message}`);
  }
}

/**
 * Polls the Replicate API until a prediction is completed (succeeded or failed).
 * @param {string} predictionId - The ID of the Replicate prediction to wait for.
 * @param {number} [timeout=180000] - Timeout in milliseconds.
 * @returns {Promise<object>} - The completed prediction object.
 */
async function waitForCompletion(predictionId, timeout = 180000) {
  const start = Date.now();
  console.log(`Waiting for prediction ${predictionId} to complete...`);
  while (Date.now() - start < timeout) {
    const prediction = await replicate.predictions.get(predictionId);
    if (prediction.status === "succeeded") {
      console.log("Prediction succeeded!");
      return prediction;
    }
    if (prediction.status === "failed") {
      throw new Error(prediction.error || "Prediction failed with no error message.");
    }
    // Wait for 3 seconds before polling again
    await new Promise(res => setTimeout(res, 3000));
  }
  throw new Error(`Timeout waiting for prediction to complete after ${timeout / 1000} seconds.`);
}
