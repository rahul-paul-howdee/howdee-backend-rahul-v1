const Replicate = require("replicate");
const cloudinary = require("cloudinary").v2;
const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const { addHowdeeWatermark } = require("../utils/addWatermarkUtil");
const { uploadToCloudinary } = require("../utils/cloudinaryUtil");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  timeout: 60000
});

const SEEDANCE_MODEL =
  "bytedance/seedance-1-pro:fb4b92e4be45c1ea50c94e71ff51ffd88fd6327e2c55efb431a9d88afdfaeb86";

/**
 * Generates subtle animation from an image, 
 * adds watermark,
 * uploads to Cloudinary, returns the Cloudinary URL
 */
// utils/videoGenerateReplicateUtil.js
exports.generateSubtleAnimation = async (imageUrl, prompt) => {
  const startTime = Date.now();
  const tmpDir = path.join(__dirname, "../tmp");
  fs.mkdirSync(tmpDir, { recursive: true });

  try {
    await validateImageUrl(imageUrl);

    console.log("🎥 Generating professional video with Seedance...");
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
      throw new Error("Video generation failed - no output URL");
    }

    const generatedVideoUrl = Array.isArray(result.output)
      ? result.output[0]
      : result.output;

    console.log("✅ Generated video:", generatedVideoUrl);

    const watermarkedUrl = await addHowdeeWatermark(generatedVideoUrl);
    console.log("✅ Watermarked video URL:", watermarkedUrl);

    const cloudinaryUrl = await uploadToCloudinary(watermarkedUrl, "video");
    console.log("✅ Cloudinary video URL:", cloudinaryUrl);

    return {
      videoUrl: cloudinaryUrl,
      replicateUrl: generatedVideoUrl,
      processingTime: `${((Date.now() - startTime) / 1000).toFixed(1)}s`
    };
  } catch (error) {
    console.error("❌ Animation Generation Error:", error);
    throw new Error(`Animation generation failed: ${error.message}`);
  }
};


/** Downloads a file to disk */
async function downloadFile(fileUrl, outputPath) {
  const response = await axios({
    url: fileUrl,
    method: "GET",
    responseType: "stream"
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

/** Validates that the provided image URL is reachable */
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

/** Polls until the Replicate prediction completes */
async function waitForCompletion(predictionId, timeout = 180000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const prediction = await replicate.predictions.get(predictionId);
    if (prediction.status === "succeeded") return prediction;
    if (prediction.status === "failed") {
      throw new Error(prediction.error || "Prediction failed");
    }
    await new Promise(res => setTimeout(res, 3000));
  }
  throw new Error(`Timeout after ${timeout / 1000} seconds`);
}

/** Cleans up a file from disk */
function cleanupFile(filePath) {
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.warn(`⚠️ Failed to clean up local file: ${err.message}`);
    }
  }
}
