function extractScores(report) {
  const technical =
    parseInt(
      report.match(
        /Technical Knowledge Score:\s*(\d+)\/10/
      )?.[1]
    ) || 0;

  const communication =
    parseInt(
      report.match(
        /Communication Score:\s*(\d+)\/10/
      )?.[1]
    ) || 0;

  const behavioral =
    parseInt(
      report.match(
        /Behavioral Score:\s*(\d+)\/10/
      )?.[1]
    ) || 0;

  const problemSolving =
    parseInt(
      report.match(
        /Problem Solving Score:\s*(\d+)\/10/
      )?.[1]
    ) || 0;

  return {
    technical: technical * 10,
    communication: communication * 10,
    behavioral: behavioral * 10,
    problemSolving: problemSolving * 10,
  };
}

module.exports = extractScores;