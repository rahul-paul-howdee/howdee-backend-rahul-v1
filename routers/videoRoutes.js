const express = require("express");
const router = express.Router();
const videoController = require("../controller/videoController");

// router.post(
//   "/animate-portrait",
//   videoController.generateAnimatedPortrait
// );
router.post(
  "/generate-professional-video",
  videoController.generateProfessionalVideo
);



module.exports = router;