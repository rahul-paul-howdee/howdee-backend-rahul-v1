const express = require("express");
const router = express.Router();
const imageController = require("../controller/imageController");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

router.post(
  "/generate-image",
  upload.single("selfie"), // Expects multipart/form-data with 'selfie' file
  imageController.generateDiwaliImage
);



module.exports = router;