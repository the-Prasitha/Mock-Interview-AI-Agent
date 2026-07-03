const express = require("express");
const multer = require("multer");
const parseResume = require("../services/resumeParser");

const router = express.Router();

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Create upload middleware
const upload = multer({ storage });

// Upload and parse resume
router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    console.log("Uploaded File:", req.file);

    // Extract text from PDF
    const resumeText = await parseResume(req.file.path);

    res.status(200).json({
      message: "Resume uploaded successfully",
      resumeText,
    });
  } catch (err) {
    console.error("ERROR:", err);

    res.status(500).json({
      message: "Error parsing resume",
      error: err.message,
    });
  }
});

module.exports = router;