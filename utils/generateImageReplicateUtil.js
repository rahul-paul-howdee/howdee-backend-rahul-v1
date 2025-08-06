// utils/generateImageReplicateUtil.js
require("dotenv").config();
const createReplicate = require("./replicateClient");

const replicate = createReplicate(process.env.REPLICATE_API_TOKEN);
const MODEL_VERSION = "aa776ca45ce7f7d185418f700df8ec6ca6cb367bfd88e9cd225666c4c179d1d7";

async function waitForCompletion(predictionId, timeout = 120000) {
  const start = Date.now();
  let p;
  while (Date.now() - start < timeout) {
    p = await replicate.predictions.get(predictionId);
    if (p.status === "succeeded") return p;
    if (p.status === "failed") throw new Error(p.error || "Generation failed");
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error(`Timeout after ${timeout / 1000}s`);
}

exports.generateDiwaliImage = async (imageUrl, prompt) => {
  try {
    const prediction = await replicate.predictions.create({
      version: MODEL_VERSION,
      input: {
        prompt,
        input_image: imageUrl,
        aspect_ratio: "match_input_image",
        output_format: "png",
        safety_tolerance: 2,
        prompt_upsampling: true
      }
    });

    const result = await waitForCompletion(prediction.id);
    if (!result.output) throw new Error("No output URL returned");

    return { status: result.status, output: result.output, metrics: result.metrics };
  } catch (err) {
    console.error("Generation Failed:", err.response?.data ?? err.message);
    throw err;
  }
};