import React, { useState } from "react";
import "./ConclusionPopup.css";

const ConclusionPopup = ({ isOpen, onClose }) => {
  const [questions, setQuestions] = useState([
    { text: "Question 1", answer: null },
    { text: "Question 2", answer: null },
    { text: "Question 3", answer: null },
    { text: "Question 4", answer: null },
    { text: "Question 5", answer: null },
  ]);

  const handleAnswerChange = (index, answer) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].answer = answer;
    setQuestions(updatedQuestions);
  };

  const sendAnswersToBackend = async () => {
    const userResponses = questions.map((question) => ({
      text: question.text,
      answer: question.answer,
    }));

    const response = await fetch("your_backend_api_endpoint_here", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userResponses,
        decision: "Accept",
      }),
    });

  };

  return (
    <div className={`popup-overlay ${isOpen ? "open" : ""}`}>
      <div className="popup">
        <h2>Conclusion</h2>
        <p>Are you sure you want to conclude this session?</p>
        <div className="questions">
          {questions.map((question, index) => (
            <div className="question" key={index}>
              <p>{question.text}</p>
              <div className="slider-container">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={question.answer || 0}
                  onChange={(e) => handleAnswerChange(index, parseInt(e.target.value))}
                />
                <span>{question.answer}%</span>
              </div>
            </div>
          ))}
        </div>
        <div className="popup-buttons">
          <button onClick={() => handleAnswerChange(null, 0)}>Reject</button>
          <button onClick={() => { sendAnswersToBackend(); onClose(); }}>Accept</button>
        </div>
      </div>
    </div>
  );
};

export default ConclusionPopup;
