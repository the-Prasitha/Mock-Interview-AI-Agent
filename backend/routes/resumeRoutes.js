const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const parseResume = require("../services/resumeParser");

const router = express.Router();

// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
});

// Upload and parse resume
router.post(
  "/upload",
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      console.log("Uploaded File:", req.file);

      const resumeText = await parseResume(
        req.file.path
      );

      res.status(200).json({
        message: "Resume uploaded successfully",
        resumeText,
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        message: "Error parsing resume",
        error: err.message,
      });
    }
  }
);

module.exports = router;