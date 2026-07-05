const mongoose = require("mongoose");

const InterviewSchema = new mongoose.Schema(
  {
    technical: Number,
    communication: Number,
    problemSolving: Number,
    behavioral: Number,
    readiness: Number,
    report: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Interview",
  InterviewSchema
);