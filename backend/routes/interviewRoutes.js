const express = require("express");
const askLLM = require("../services/llmServices");

const router = express.Router();

// Generate first question
router.post("/start", async (req, res) => {
  try {
    const { resumeText, company, role } = req.body;

    const prompt = `
You are an expert interviewer.

Candidate Resume:
${resumeText}

Target Company:
${company}

Target Role:
${role}

Conduct a realistic interview.

Rules:
1. Ask ONLY ONE question.
2. Start with an introductory question or a project-based question.
3. Do not provide answers.
4. Keep it conversational.
`;

    const question = await askLLM(prompt);

    res.json({ question });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to generate question",
    });
  }
});

// Generate follow-up question
router.post("/chat", async (req, res) => {
  try {
    const { history, answer } = req.body;

    const prompt = `
You are an expert interviewer.

Previous Interview Conversation:
${history}

Candidate's Latest Answer:
${answer}

Rules:
1. Analyze the answer.
2. Ask ONE follow-up question.
3. If the answer is weak, probe deeper.
4. Mix technical and behavioral questions.
5. Be conversational.
6. Do not provide answers.
`;

    const question = await askLLM(prompt);

    res.json({ question });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to generate next question",
    });
  }
});

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