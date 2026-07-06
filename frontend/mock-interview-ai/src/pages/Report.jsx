import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "../styles/Report.css";
import { API } from "../services/api";

function Report() {
  const location = useLocation();
  const navigate = useNavigate();

  const report = location.state?.report;
  const scores = location.state?.scores;
  const readiness = location.state?.readiness;

  const [rewrite, setRewrite] = useState("");
  const [loading, setLoading] = useState(false);

  const getRewrite = async () => {
    const answer = prompt(
      "Paste one of your interview answers:"
    );

    if (!answer) return;

    try {
      setLoading(true);

      const res = await axios.post(
        `${API}/api/interview/rewrite`,
        {
          answer,
          role: "Software Engineer",
        }
      );

      setRewrite(res.data.rewrite);
    } catch (err) {
      console.log(err);
      alert("Failed to generate rewrite.");
    }

    setLoading(false);
  };

  return (
    <div className="report-container">
      <div className="report-header">
        <h1>AI Interview Report</h1>
      </div>

      {readiness && (
        <div className="readiness-card">
          <h2>Placement Readiness</h2>

          <div className="percentage">
            {readiness.score}%
          </div>

          <div className="progress">
            <div
              className="progress-fill"
              style={{
                width: `${readiness.score}%`,
              }}
            ></div>
          </div>

          <div className="status">
            {readiness.status}
          </div>
        </div>
      )}

      {scores && (
        <div className="scores-card">
          <h2>Performance Breakdown</h2>

          <div className="score-item">
            <span>Technical Knowledge</span>
            <span>{scores.technical}/100</span>
          </div>

          <div className="score-item">
            <span>Communication</span>
            <span>{scores.communication}/100</span>
          </div>

          <div className="score-item">
            <span>Problem Solving</span>
            <span>{scores.problemSolving}/100</span>
          </div>

          <div className="score-item">
            <span>Behavioral</span>
            <span>{scores.behavioral}/100</span>
          </div>
        </div>
      )}

      <div className="feedback-card">
        <h2>Detailed Feedback</h2>
        <pre>{report}</pre>
      </div>

      <div className="feedback-card">
        <h2>💡 What You Should Have Said</h2>

        <button
          className="rewrite-btn"
          onClick={getRewrite}
        >
          Generate Better Answer
        </button>

        {loading && <p>Generating...</p>}

        {rewrite && (
          <pre className="rewrite-text">
            {rewrite}
          </pre>
        )}
      </div>

      <div className="button-container">
        <button
          onClick={() => navigate("/")}
        >
          Retake Interview
        </button>
      </div>
    </div>
  );
}

export default Report;