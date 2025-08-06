const express = require("express");
const multer = require("multer");
const router = express.Router();
const { transcribeAudio } = require("../controller/whisperController");
const path = require('path');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + ext);
  },
});

const fileFilter = function (req, file, cb) {
  const allowedTypes = [
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/x-wav",
    "audio/mp4",
    "audio/webm",
    "video/mp4",
    "audio/ogg",
    "audio/m4a",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({ storage, fileFilter });

router.post("/transcribe", upload.single("audio"), transcribeAudio);

module.exports = router;
