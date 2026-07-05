const { exec } = require("child_process");

function predictReadiness(
  technical,
  communication,
  problemSolving,
  behavioral
) {
  return new Promise((resolve, reject) => {
    const command =
      `python ../ml-model/predict.py ` +
      `${technical} ` +
      `${communication} ` +
      `${problemSolving} ` +
      `${behavioral}`;

    exec(command, (err, stdout) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(stdout.trim());
    });
  });
}

module.exports = predictReadiness;