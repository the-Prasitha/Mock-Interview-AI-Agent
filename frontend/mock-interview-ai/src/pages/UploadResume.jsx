import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/UploadResume.css";
import { API } from "../services/api";

function UploadResume() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF resume.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);

      const res = await axios.post(
        `${API}/api/resume/upload`,
        formData
      );

      const resumeText =
        res.data.resumeText ||
        res.data.text ||
        "";

      navigate("/setup", {
        state: { resumeText },
      });
    } catch (err) {
      console.log(err);
      alert("Resume upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-container">
      <div className="hero-card">

        <div className="robot-icon">
          🤖
        </div>

        <h1 className="title">
          Mock Interview <span>AI</span>
        </h1>

        <p className="subtitle">
          Your AI-powered partner for interview preparation
        </p>

        <div className="upload-box">

          <h2>Upload Your Resume (PDF)</h2>

          <p>
            Drag & drop your file here or click below
          </p>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) =>
              setFile(e.target.files[0])
            }
          />

          {file && (
            <p className="filename">
              📄 {file.name}
            </p>
          )}

          <button
            className="upload-btn"
            onClick={handleUpload}
          >
            {loading
              ? "Uploading..."
              : "Upload Resume & Continue →"}
          </button>
        </div>

        <div className="features">
          <div className="feature-card">
            💬
            <h4>AI Interviews</h4>
            <p>Adaptive questions</p>
          </div>

          <div className="feature-card">
            📈
            <h4>Detailed Feedback</h4>
            <p>Performance insights</p>
          </div>

          <div className="feature-card">
            🔒
            <h4>Private & Secure</h4>
            <p>Your data stays safe</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadResume;