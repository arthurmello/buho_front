import React, { useState } from "react";
import "./questionform.css";

const QuestionForm = ({ onQuestionSubmit }) => {
  const [question, setQuestion] = useState("");
  const [owner, setOwner] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onQuestionSubmit({ question, owner });
    setQuestion("");
    setOwner("");
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-input">
        <label className="form-label">Question:</label>
        <textarea
          id="question"
          className="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>
      <div className="form-input">
        <label className="form-label">Owner:</label>
        <input
          type="text"
          id="owner"
          value={owner}
          className="owner"
          onChange={(e) => setOwner(e.target.value)}
        />
      </div>
      <button type="submit" className="btn" disabled={!question || !owner}>
        Submit
      </button>
    </form>
  );
};

export default QuestionForm;
