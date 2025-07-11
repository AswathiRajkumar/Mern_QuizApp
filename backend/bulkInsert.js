const mongoose = require("mongoose");
const Question = require("./models/Question"); // Adjust if path differs
const questions = require("./questions.json"); // Your array of questions

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/quiz-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ MongoDB connected");

    // Clear old questions
    await Question.deleteMany({});
    console.log("🧹 Old questions deleted");

    // Insert fresh questions
    await Question.insertMany(questions);
    console.log(`✅ ${questions.length} new questions inserted`);

    // Close the DB connection
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
  });
