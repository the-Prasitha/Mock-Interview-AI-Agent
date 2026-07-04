import { useLocation } from "react-router-dom";
import "../styles/Report.css";

function Report() {
  const location = useLocation();

  const report = location.state?.report || "";

  return (
    <div className="report-page">
      <div className="report-card">

        <h1>Interview Analysis</h1>

        <pre>{report}</pre>
      </div>
    </div>
  );
}

export default Report;