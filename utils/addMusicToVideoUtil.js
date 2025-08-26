const Replicate = require("replicate");
require("dotenv").config();

// --- Replicate Client Initialization ---
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const VIDEO_AUDIO_MERGE_MODEL = "lucataco/video-audio-merge:8c3d57c9c9a1aaa05feabafbcd2dff9f68a5cb394e54ec020c1c2dcc42bde109";
const HARDCODED_AUDIO_URL = "https://res.cloudinary.com/dqiqtx7er/video/upload/v1756189395/Deva_Shree_Ganesha___Ganesh_Chaturthi_WhatsApp_Status___Hrithik_Roshan_shorts_e4qnnp.mp3";

/**
 * Merges a given video with a hardcoded audio file using a robust polling method.
 * @param {string} videoUrl - The direct public URL of the video file to process.
 * @returns {Promise<string>} - A promise that resolves to the direct URL of the merged video.
 */
async function mergeVideoWithAudio(videoUrl) {
  console.log(`Starting merge for video: ${videoUrl}`);
  try {
    // Input for the Replicate model
    const input = {
      video_file: videoUrl,
      audio_file: HARDCODED_AUDIO_URL,
    };

    // Step 1: Create the prediction
    console.log("Creating Replicate prediction for 'lucataco/video-audio-merge'...");
    const prediction = await replicate.predictions.create({
      version: VIDEO_AUDIO_MERGE_MODEL,
      input: input,
    });

    // Step 2: Wait for the prediction to complete using the polling helper
    const result = await waitForCompletion(prediction.id);

    // Step 3: Validate and extract the output URL
    if (!result?.output) {
      throw new Error("Video merge failed - no output URL from Replicate");
    }

    const mergedVideoUrl = Array.isArray(result.output)
      ? result.output[0]
      : result.output;

    if (!mergedVideoUrl || !mergedVideoUrl.startsWith("http")) {
        throw new Error(`Invalid merged video URL received: ${mergedVideoUrl}`);
    }

    console.log(`✅ Merge successful! Output URL: ${mergedVideoUrl}`);
    return mergedVideoUrl;

  } catch (error) {
    console.error("❌ Error during video-audio merge:", error.message);
    // Re-throw the error so the calling function can handle it.
    throw error;
  }
}

/**
 * Polls the Replicate API until a prediction is completed (succeeded or failed).
 * This helper is now used by both video generation and audio merging.
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
      console.log(`Prediction ${predictionId} succeeded!`);
      return prediction;
    }
    if (prediction.status === "failed") {
      throw new Error(prediction.error || `Prediction ${predictionId} failed with no error message.`);
    }
    // Wait for 3 seconds before polling again
    await new Promise(res => setTimeout(res, 3000));
  }
  throw new Error(`Timeout waiting for prediction to complete after ${timeout / 1000} seconds.`);
}


module.exports = { mergeVideoWithAudio };
