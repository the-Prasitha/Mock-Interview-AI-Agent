import { BrowserRouter, Routes, Route } from "react-router-dom";
import UploadResume from "./pages/UploadResume";
import InterviewSetup from "./pages/InterviewSetup";
import InterviewChat from "./pages/InterviewChat";
import Report from "./pages/Report";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UploadResume />} />
        <Route path="/setup" element={<InterviewSetup />} />
        <Route path="/chat" element={<InterviewChat />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;