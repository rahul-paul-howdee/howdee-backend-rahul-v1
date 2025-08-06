const { execSync, writeFileSync, unlinkSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const MODEL_VERSION = "aa776ca45ce7f7d185418f700df8ec6ca6cb367bfd88e9cd225666c4c179d1d7";

function createPredictionCurl(imageUrl, prompt) {
  console.log("Creating prediction for:", imageUrl);

  const payload = {
    version: MODEL_VERSION,
    input: {
      prompt,
      input_image: imageUrl,
      aspect_ratio: "match_input_image",
      output_format: "png",
      safety_tolerance: 2,
      prompt_upsampling: true
    }
  };

  const tmpPath = path.join(__dirname, "tmp_payload.json");
  fs.writeFileSync(tmpPath, JSON.stringify(payload));

  try {
    const curlCommand = `
      curl -s -X POST https://api.replicate.com/v1/predictions \
      -H "Authorization: Token ${REPLICATE_API_TOKEN}" \
      -H "Content-Type: application/json" \
      --data @${tmpPath}
    `;

    const response = execSync(curlCommand).toString().trim();
    fs.unlinkSync(tmpPath); // clean up

    if (!response) throw new Error("Empty response from Replicate");
    return JSON.parse(response);
  } catch (err) {
    console.error("Curl create prediction failed:", err.message);
    throw err;
  }
}

function getPredictionStatusCurl(predictionId) {
  try {
    const curlCommand = `
      curl -s -X GET https://api.replicate.com/v1/predictions/${predictionId} \
      -H "Authorization: Token ${REPLICATE_API_TOKEN}"
    `;

    const response = execSync(curlCommand).toString().trim();
    if (!response) throw new Error("Empty status response");
    return JSON.parse(response);
  } catch (err) {
    console.error("Curl get status failed:", err.message);
    throw err;
  }
}

const waitForCompletion = async (predictionId) => {
  while (true) {
    const result = getPredictionStatusCurl(predictionId);
    if (["succeeded", "failed", "canceled"].includes(result.status)) return result;
    await new Promise((r) => setTimeout(r, 2000));
  }
};

const generateDiwaliImage = async (imageUrl, prompt) => {
  try {
    const prediction = createPredictionCurl(imageUrl, prompt);
    const result = await waitForCompletion(prediction.id);

    if (!result.output) throw new Error("No output from prediction");
    return {
      status: result.status,
      output: result.output,
      metrics: result.metrics
    };
  } catch (err) {
    console.error("Generation Failed:", err.message);
    throw err;
  }
};

module.exports = { generateDiwaliImage };
