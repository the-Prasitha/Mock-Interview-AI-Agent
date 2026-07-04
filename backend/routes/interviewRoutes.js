const express = require("express");
const askLLM = require("../services/llmServices");

const router = express.Router();

// ================= START INTERVIEW =================
router.post("/start", async (req, res) => {
  try {
    const { resumeText, company, role, experience } = req.body;

    const prompt = `
You are a senior interviewer conducting a real interview.

Candidate Resume:
${resumeText}

Target Company:
${company}

Target Role:
${role}

Experience:
${experience}

Instructions:
1. Ask ONLY ONE question.
2. Start with an introductory question or a question based on the candidate's projects or skills.
3. Mix technical and behavioral questions throughout the interview.
4. Be conversational like a human interviewer.
5. Never provide answers.
`;

    const question = await askLLM(prompt);

    res.json({
      question,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Failed to generate question",
    });
  }
});

// ================= FOLLOW-UP QUESTIONS =================
router.post("/chat", async (req, res) => {
  try {
    const { history, answer } = req.body;

    const prompt = `
You are a senior interviewer conducting a real interview.

Previous Interview Conversation:
${history}

Candidate's Latest Answer:
${answer}

Instructions:
1. Analyze the candidate's latest answer.
2. Ask ONLY ONE next question.
3. If the answer is weak, ask a follow-up question.
4. If the answer is good, move to another technical or behavioral question.
5. Be conversational like a human interviewer.
6. Never provide answers.
`;

    const question = await askLLM(prompt);

    res.json({
      question,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Failed to generate next question",
    });
  }
});

// ================= GENERATE REPORT =================
router.post("/report", async (req, res) => {
  try {
    const { conversation } = req.body;

    const prompt = `
You are an expert interview evaluator.

Interview Transcript:
${conversation}

Analyze the candidate and return the response in the following format:

Technical Knowledge Score: x/10
Communication Score: x/10
Behavioral Score: x/10
Problem Solving Score: x/10

Strengths:
- Point 1
- Point 2

Areas for Improvement:
- Point 1
- Point 2

Recommended Topics:
- Topic 1
- Topic 2

Overall Feedback:
Provide a short paragraph summarizing the candidate's performance.
`;

    const report = await askLLM(prompt);

    res.json({
      report,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Failed to generate report",
    });
  }
});

module.exports = router;