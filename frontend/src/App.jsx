import React, { useState } from "react";
import QuizApp from "./QuizApp"; // Your main quiz logic file
import "./App.css"; // Import CSS for styling

function App() {
  const [username, setUsername] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);
  const [nameWarning, setNameWarning] = useState(false);

  const handleStartQuiz = () => {
    if (!username.trim()) {
      setNameWarning(true);
      return;
    }
    setNameWarning(false);
    setQuizStarted(true);
  };

  if (!quizStarted) {
    return (
      <div className="App">
        <div className="quiz-box">
          <h2>👋 Welcome to the Quiz!</h2>
          <p>Please enter your name to begin:</p>
          <input
            type="text"
            className="input-box"
            value={username}
            placeholder="Enter your name"
            onChange={(e) => setUsername(e.target.value)}
          />
          {nameWarning && (
            <p className="warning">⚠️ Please enter your name to continue.</p>
          )}
          <button className="next-btn" onClick={handleStartQuiz}>
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  return <QuizApp username={username} />;
}

export default App;
