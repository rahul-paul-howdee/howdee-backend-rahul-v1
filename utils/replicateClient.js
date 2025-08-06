// utils/replicateClient.js
const Replicate = require("replicate");

module.exports = function createReplicate(token) {
  return new Replicate({
    auth: token,
    timeout: 60000,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) HowdeeBackend/1.0"
  });
};
