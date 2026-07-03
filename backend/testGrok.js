require("dotenv").config();

const askLLM = require("./services/llmServices");

async function test() {
  try {
    const response = await askLLM(
      "Ask one Java interview question."
    );

    console.log(response);
  } catch (err) {
    console.log(err);
  }
}

test();