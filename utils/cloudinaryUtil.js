// helpers/cloudinary.js
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadToCloudinary = async (fileToUpload, resourceType = 'auto') => {
  try {
    const result = await cloudinary.uploader.upload(fileToUpload, {
      folder: "howdee-mvp-v1",
      resource_type: resourceType,
    });
    return result.secure_url;
  } catch (error) {
    // Throws a more informative error message.
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};
