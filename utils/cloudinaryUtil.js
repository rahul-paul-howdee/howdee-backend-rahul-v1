// helpers/cloudinary.js
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadToCloudinary = async (filePathOrUrl, isUrl = false) => {
  try {
    const result = await cloudinary.uploader.upload(filePathOrUrl, {
      folder: "howdee-mvp-v1",
      ...(isUrl ? { resource_type: "image" } : {}) // for URL-based upload
    });
    return result.secure_url;
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};
