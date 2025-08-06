// controllers/transcriptionController.js
const fs = require("fs");
const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.transcribeAudio = async (req, res) => {
  try {
      console.log("Uploaded file:", req.file);
    const audioPath = req.file.path;
    const audioFile = fs.createReadStream(audioPath);


    const response = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });

    fs.unlinkSync(audioPath); // delete uploaded file

    res.json({ transcript: response.text });
  } catch (err) {
    console.error("Transcription error:", err.message);
    res.status(500).json({ error: "Failed to transcribe audio." });
  }
};
