// Ensure you have the 'replicate' package installed: npm install replicate
const Replicate = require("replicate");

// Initialize Replicate with your API token.
// It's best practice to use an environment variable for your token.
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// The hardcoded audio file URL as requested.
const HARDCODED_AUDIO_URL = "https://res.cloudinary.com/dqiqtx7er/video/upload/v1756189395/Deva_Shree_Ganesha___Ganesh_Chaturthi_WhatsApp_Status___Hrithik_Roshan_shorts_e4qnnp.mp3";

/**
 * Merges a given video with a hardcoded audio file using the Replicate API.
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

    console.log("Running Replicate model 'lucataco/video-audio-merge'...");
    // Run the model on Replicate
    const output = await replicate.run(
      "lucataco/video-audio-merge:8c3d57c9c9a1aaa05feabafbcd2dff9f68a5cb394e54ec020c1c2dcc42bde109",
      { input }
    );

    // The Replicate API can return the output in various formats.
    // This logic robustly extracts the URL regardless of the format.
    let mergedVideoUrl;
    if (typeof output === 'string' && output.startsWith("http")) {
        mergedVideoUrl = output;
    } else if (Array.isArray(output) && output.length > 0) {
        mergedVideoUrl = output[0];
    } else {
        throw new Error(`Unexpected output format from Replicate: ${JSON.stringify(output)}`);
    }

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

// --- Example Usage ---
// To use this function, you would call it from another part of your application.
// For example, in an Express.js route handler:
/*
  app.post('/merge-video', async (req, res) => {
    const { videoUrl } = req.body;

    if (!videoUrl) {
      return res.status(400).json({ error: 'videoUrl is required' });
    }

    try {
      const finalUrl = await mergeVideoWithAudio(videoUrl);
      res.json({ success: true, mergedUrl: finalUrl });
    } catch (error) {
      res.status(500).json({ error: 'Failed to merge video.' });
    }
  });
*/

// You can also export the function to use it in other files.
module.exports = { mergeVideoWithAudio };
