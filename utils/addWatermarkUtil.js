const Replicate = require("replicate");

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

/**
 * Adds a "HOWDEE" watermark to the given video.
 * @param {string} videoUrl - The direct URL of the video to watermark
 * @returns {Promise<string>} - Direct URL to the watermarked video
 */
async function addHowdeeWatermark(videoUrl) {
  try {
    const output = await replicate.run(
      "charlesmccarthy/addwatermark:f274d1efdd9d249cef68fccd028d70e4134b2d59f2b02b42a4e78350849d0e57",
      {
        input: {
          size: 25,
          video: videoUrl,
          watermark: "HOWDEE",
        },
      }
    );

    let watermarkedUrl;
    if (output?.constructor?.name === "FileOutput" && typeof output.url === "function") {
      const urlResult = await output.url();
      watermarkedUrl = urlResult instanceof URL ? urlResult.toString() : String(urlResult);
    } else if (Array.isArray(output)) {
      watermarkedUrl = output[0];
    } else {
      watermarkedUrl = output?.url || output?.output || String(output);
    }

    if (!watermarkedUrl || !watermarkedUrl.startsWith("http")) {
      throw new Error(`Invalid watermarked file URL: ${watermarkedUrl}`);
    }

    return watermarkedUrl;
  } catch (error) {
    console.error("❌ Watermark error:", error.message);
    throw error;
  }
}

module.exports = { addHowdeeWatermark };
