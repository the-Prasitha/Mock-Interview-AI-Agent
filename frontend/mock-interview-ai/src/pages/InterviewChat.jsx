import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/InterviewChat.css";

function InterviewChat() {
  const location = useLocation();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: location.state?.firstQuestion || "Hello! Welcome to the interview.",
    },
  ]);

  const [answer, setAnswer] = useState("");
  const [listening, setListening] = useState(false);

  // ================= SPEAK FUNCTION =================

  const speak = (text) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  // Speak first question automatically
  useEffect(() => {
    if (location.state?.firstQuestion) {
      speak(location.state.firstQuestion);
    }
  }, []);

  // ================= VOICE INPUT =================

  const startListening = () => {
    if (!window.webkitSpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition =
      new window.webkitSpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript;

      setAnswer(transcript);
    };

    recognition.start();
  };

  // ================= SEND ANSWER =================

  const sendAnswer = async () => {
    if (!answer.trim()) return;

    const userMessage = {
      sender: "user",
      text: answer,
    };

    const updatedMessages = [
      ...messages,
      userMessage,
    ];

    setMessages(updatedMessages);

    try {
      const history = updatedMessages
        .map((m) => `${m.sender}: ${m.text}`)
        .join("\n");

      const res = await axios.post(
        "http://localhost:5000/api/interview/chat",
        {
          history,
          answer,
        }
      );

      const aiMessage = {
        sender: "ai",
        text: res.data.question,
      };

      const finalMessages = [
        ...updatedMessages,
        aiMessage,
      ];

      setMessages(finalMessages);

      // Speak next question
      speak(res.data.question);

      setAnswer("");
    } catch (err) {
      console.log(err);
      alert("Failed to get next question.");
    }
  };

  // ================= FINISH INTERVIEW =================

  const finishInterview = async () => {
    try {
      const conversation = messages
        .map((m) => `${m.sender}: ${m.text}`)
        .join("\n");

      const res = await axios.post(
        "http://localhost:5000/api/interview/report",
        {
          conversation,
        }
      );

      navigate("/report", {
        state: {
          report: res.data.report,
        },
      });
    } catch (err) {
      console.log(err);
      alert("Failed to generate report.");
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-card">

        <h1>🤖 AI Interviewer</h1>

        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.sender === "ai"
                  ? "ai-message"
                  : "user-message"
              }
            >
              <b>
                {msg.sender === "ai"
                  ? "AI"
                  : "You"}
                :
              </b>

              <p>{msg.text}</p>
            </div>
          ))}
        </div>

        <textarea
          value={answer}
          onChange={(e) =>
            setAnswer(e.target.value)
          }
          placeholder="Type your answer or use voice..."
        />

        <div className="buttons">

          <button onClick={sendAnswer}>
            Send Answer
          </button>

          <button onClick={startListening}>
            {listening
              ? "🎤 Listening..."
              : "🎤 Speak"}
          </button>

          <button onClick={finishInterview}>
            Finish Interview
          </button>

        </div>
      </div>
    </div>
  );
}

export default InterviewChat;