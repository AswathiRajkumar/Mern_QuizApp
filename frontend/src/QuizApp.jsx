import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function QuizApp({ username }) {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [warning, setWarning] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);

  // 🔁 Shuffle helper
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // 🔁 Fetch and shuffle questions + options
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/quiz")
      .then((res) => {
        const shuffledQuestions = shuffleArray(res.data).map((q) => ({
          ...q,
          options: shuffleArray(q.options),
        }));
        setQuestions(shuffledQuestions);
      })
      .catch((err) => console.error("Error fetching quiz:", err));
  }, []);

  // ⏳ Timer logic with auto next
  useEffect(() => {
    if (timeLeft === 0) {
      const updatedAnswers = [...userAnswers];
      if (!updatedAnswers[currentQuestion]) {
        updatedAnswers[currentQuestion] = "No Answer";
        setUserAnswers(updatedAnswers);
      }
      handleNext();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, currentQuestion]);

  const handleOptionChange = (e) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestion] = e.target.value;
    setUserAnswers(updatedAnswers);
    setWarning("");
  };

  const handleNext = () => {
    const answer = userAnswers[currentQuestion];

    // Calculate score only if answer is correct
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setTimeLeft(30); // 🔄 Reset timer
    } else {
      setQuizCompleted(true);
    }
  };

  if (questions.length === 0) return <p>Loading questions...</p>;

  if (quizCompleted) {
    return (
      <div className="quiz-box">
        <h2>🎉 Quiz Completed!</h2>
        <p>
          {username}, your score is: <strong>{score}</strong> /{" "}
          {questions.length}
        </p>
        <p className="motivation">
          {score === questions.length
            ? "🏆 Perfect! You're amazing!"
            : score >= questions.length / 2
            ? "👏 Well done! Keep learning!"
            : "💡 Don't worry, practice makes perfect!"}
        </p>
      </div>
    );
  }

  return (
    <div className="quiz-box">
      <div className="progress-bar-container">
        <div
          className="progress-bar"
          style={{ width: `${(timeLeft / 30) * 100}%` }}
        ></div>
      </div>

      <div className="question-text">
        <strong>Question {currentQuestion + 1} of {questions.length}</strong>
      </div>
      <div className="question-text">
        {questions[currentQuestion].questionText}
      </div>

      <div className="timer">⏳ Time left: {timeLeft}s</div>

      <div className="options">
        {questions[currentQuestion].options.map((option, idx) => (
          <label key={idx} className="option-label">
            <input
              type="radio"
              value={option}
              checked={userAnswers[currentQuestion] === option}
              onChange={handleOptionChange}
              name={`q${currentQuestion}`}
            />
            {option}
          </label>
        ))}
      </div>

      {warning && <div className="warning">{warning}</div>}

      <button onClick={handleNext} className="next-btn">
        {currentQuestion === questions.length - 1 ? "Submit" : "Next"}
      </button>
    </div>
  );
}

export default QuizApp;
