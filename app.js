const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Allow requests from any origin
app.use(cors());

const imageRoutes = require("./routers/imageRoutes");
const videoRoutes = require("./routers/videoRoutes");
const whisperRoutes = require("./routers/whisperRoutes");

app.use(express.json());
app.use("/api/v1/image", imageRoutes);
app.use("/api/v1/video", videoRoutes);
app.use("/api/v1/whisper", whisperRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Howdee server is running", version: "1.0.0" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));