import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/InterviewSetup.css";

function InterviewSetup() {
  const location = useLocation();
  const navigate = useNavigate();

  const resumeText = location.state?.resumeText || "";

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");

  const startInterview = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/interview/start",
        {
          resumeText,
          company,
          role,
          experience,
        }
      );

      navigate("/chat", {
        state: {
          firstQuestion: res.data.question,
        },
      });
    } catch (err) {
      console.log(err);
      alert("Unable to start interview.");
    }
  };

  return (
    <div className="setup-page">
      <div className="setup-card">
        <h1>Interview Setup</h1>

        <input
          type="text"
          placeholder="Company Name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />

        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <input
          type="text"
          placeholder="Experience (Fresher / 1 Year)"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />

        <button onClick={startInterview}>
          Start Interview →
        </button>
      </div>
    </div>
  );
}

export default InterviewSetup;