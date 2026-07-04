import { useState } from "react";

function VoiceInterview({ setAnswer }) {
  const [listening, setListening] =
    useState(false);

  const startListening = () => {
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
      const text =
        event.results[0][0].transcript;

      setAnswer(text);
    };

    recognition.start();
  };

  return (
    <button onClick={startListening}>
      {listening
        ? "🎤 Listening..."
        : "🎤 Start Speaking"}
    </button>
  );
}

export default VoiceInterview;