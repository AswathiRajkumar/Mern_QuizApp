// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// ✅ Import from Question.js (case-sensitive on some systems!)
const Question = require("./models/Question");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/quiz-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// API to fetch quiz questions
app.get("/api/quiz", async (req, res) => {
  try {
    const questions = await Question.find();
    console.log("🧪 Questions fetched:", questions.length);
    res.json(questions);
  } catch (err) {
    console.error("❌ Error fetching questions:", err);
    res.status(500).json({ error: "Failed to fetch quiz questions" });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
