const express = require("express");
const askLLM = require("../services/llmServices");
const extractScores = require("../services/scoreExtractor");
const calculateReadiness = require("../services/readinessService");
const predictReadiness = require("../services/predictServices");
const db = require("../database/db");

const router = express.Router();


// ================= START INTERVIEW =================
router.post("/start", async (req, res) => {
  try {
    const {
      resumeText,
      company,
      role,
      experience,
      stressLevel,
    } = req.body;

    let interviewerStyle = "";

    if (stressLevel === "friendly") {
      interviewerStyle = `
You are a friendly recruiter.
Be supportive and encouraging.
Ask questions in a warm and positive manner.
`;
    } else if (stressLevel === "busy") {
      interviewerStyle = `
You are a busy senior engineer.
Ask short and direct questions.
Focus on technical depth.
`;
    } else {
      interviewerStyle = `
You are a skeptical interviewer.
Challenge assumptions.
Ask tradeoffs.
Push the candidate to justify decisions.
`;
    }

    const prompt = `
${interviewerStyle}

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
2. Start with an introductory question or a project-based question.
3. Never provide answers.
4. Be conversational.
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
1. Analyze the answer.
2. Ask ONLY ONE next question.
3. If the answer is weak, ask a follow-up question.
4. If the answer is good, move to another technical or behavioral question.
5. Never provide answers.
6. Be conversational.
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
  console.log("REPORT API HIT");

  try {
    const { conversation } = req.body;

    // Interview incomplete
    if (!conversation || conversation.trim().length < 100) {
      return res.json({
        report:
          "Interview is incomplete. Not enough answers to evaluate the candidate.",
        scores: {
          technical: 0,
          communication: 0,
          problemSolving: 0,
          behavioral: 0,
        },
        readiness: {
          score: 0,
          status: "Interview Incomplete",
        },
        mlPrediction: "NOT_READY",
      });
    }

    const prompt = `
You are a strict interview evaluator.

Interview Transcript:
${conversation}

Evaluate ONLY based on the candidate's answers.

Rules:
1. Do NOT assume knowledge that was not demonstrated.
2. If the candidate skipped questions or gave vague answers, assign low scores.
3. If there is insufficient information, keep scores between 1 and 4.
4. Give scores above 8 only when the candidate demonstrates strong understanding.
5. Do not be generous.

Return EXACTLY in this format:

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
- Short paragraph.
`;

    const report = await askLLM(prompt);

    console.log(report);

    const scores = extractScores(report);

    const readiness = calculateReadiness(
      scores.technical,
      scores.communication,
      scores.problemSolving,
      scores.behavioral
    );

    const mlPrediction = await predictReadiness(
      scores.technical,
      scores.communication,
      scores.problemSolving,
      scores.behavioral
    );

    // ================= SAVE TO SQLITE =================
    db.run(
      `
      INSERT INTO interviews
      (
        technical,
        communication,
        problemSolving,
        behavioral,
        readiness,
        report
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        scores.technical,
        scores.communication,
        scores.problemSolving,
        scores.behavioral,
        readiness.score,
        report,
      ],
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log(
            "Interview saved to SQLite."
          );
        }
      }
    );

    res.json({
      report,
      scores,
      readiness,
      mlPrediction,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Failed to generate report",
    });
  }
});


// ================= INTERVIEW HISTORY =================
router.get("/history", (req, res) => {
  db.all(
    `
    SELECT *
    FROM interviews
    ORDER BY id DESC
    `,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          message:
            "Failed to fetch history",
        });
      }

      res.json(rows);
    }
  );
});


// ================= READINESS TEST =================
router.post("/readiness", async (req, res) => {
  try {
    const {
      technical,
      communication,
      problemSolving,
      behavioral,
    } = req.body;

    const result = await predictReadiness(
      technical,
      communication,
      problemSolving,
      behavioral
    );

    res.json({
      readiness: result,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message:
        "Failed to predict readiness",
    });
  }
});


// ================= WHAT YOU SHOULD HAVE SAID =================
router.post("/rewrite", async (req, res) => {
  try {
    const { answer, role } = req.body;

    const prompt = `
You are an expert interview coach.

Candidate Answer:
${answer}

Target Role:
${role}

Rewrite the answer to make it:

1. Professional
2. Clear and concise
3. Highlight the candidate's contribution
4. Sound interview-ready
5. Do NOT invent experiences.

Return exactly in this format:

Optimized Answer:
...

Why It's Better:
...
`;

    const rewrite =
      await askLLM(prompt);

    res.json({
      rewrite,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message:
        "Failed to rewrite answer",
    });
  }
});

module.exports = router;