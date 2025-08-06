// test-replicate.js
import fetch from "node-fetch";
import Replicate from "replicate";
import dotenv from "dotenv";
dotenv.config();

console.log("Token present:", process.env.REPLICATE_API_TOKEN ? "✅ yes" : "❌ no");

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  timeout: 30000,
  // override fetch so we mimic a real browser UA
  fetch: async (url, init = {}) => {
    init.headers = {
      "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36",
      Accept: "application/json"
    };
    return fetch(url, init);
  }
});

const versionId = "aa776ca45ce7f7d185418f700df8ec6ca6cb367bfd88e9cd225666c4c179d1d7";
const input = { prompt: "test" };

(async () => {
  try {
    console.log("Calling replicate...");
    const p = await replicate.predictions.create({ version: versionId, input });
    console.log("Response:", JSON.stringify(p, null, 2));
  } catch (err) {
    console.error("Error occurred:", err);
    console.error("Full response body if any:", err.response?.data);
  }
})();
