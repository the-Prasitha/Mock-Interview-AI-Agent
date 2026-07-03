const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const resumeRoutes = require("./routes/resumeRoutes");

app.use("/api/resume", resumeRoutes);

app.get("/", (req, res) => {
  res.send("Mock Interview AI Backend Running 🚀");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});