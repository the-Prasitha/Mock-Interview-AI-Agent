function calculateReadiness(
  technical,
  communication,
  problemSolving,
  behavioral
) {
  const score =
    technical * 0.4 +
    problemSolving * 0.25 +
    communication * 0.2 +
    behavioral * 0.15;

  let status = "";

  if (score >= 90) {
    status = "Excellent";
  } else if (score >= 75) {
    status = "Interview Ready";
  } else if (score >= 60) {
    status = "Needs Improvement";
  } else {
    status = "Requires Preparation";
  }

  return {
    score: Math.round(score),
    status,
  };
}

module.exports = calculateReadiness;