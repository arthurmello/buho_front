import React, { useState, useEffect } from "react";
import { BiPlus, BiSolidTrash } from "react-icons/bi";
import { resetQaTracker, fetchQaTracker,  onQuestionSubmitted } from "../../api/qaTracker"
import GenericModal from "../GenericModal/GenericModal";
import QuestionForm from "../QuestionForm/QuestionForm";

const QaTracker = ({ userIdParam, dealParam, qaTracker, setQaTracker, isShowQuestionsSidebar, setText, owner, setOwner }) => {
    const [showQAModal, setShowQAModal] = useState(false);

    useEffect(() => {
        fetchQaTracker(userIdParam, dealParam, setQaTracker);
      }, [userIdParam, dealParam]);

    return (
        <>
            <section className={`sidebar ${isShowQuestionsSidebar ? "open" : ""}`}>
            <div className="sidebar-header" role="button">
            <p>Q&A Tracker</p>
            </div>
            <div className="sidebar-history">
            {qaTracker.map((history, index) => (
                <div
                className="question-box"
                onClick={() => {
                    setOwner(history.owner);
                    setText(history.question);
                }}
                key={index}
                >
                <p className="question-owner">{index + 1}. Question asked by: {history.owner}</p>
                <p className="question-text">{history.question}</p>
                </div>
            ))}
            </div>
            <div className="sidebar-info">
            <div className="sidebar-header" onClick={() => setShowQAModal(true)} role="button">
                <BiPlus size={20} />
                <button>Add Question</button>
            </div>
            <div className="sidebar-header" onClick={() => resetQaTracker(userIdParam, dealParam, setQaTracker)} role="button">
                <BiSolidTrash size={20} />
                <button>Clear Q&A Tracker</button>
            </div>
            </div>

            <GenericModal show={showQAModal} handleClose={() => setShowQAModal(false)}>
            <QuestionForm onQuestionSubmit={(data) => onQuestionSubmitted(data, userIdParam, dealParam, setQaTracker, fetchQaTracker, setShowQAModal)} owner={owner} setOwner={setOwner}/>
            </GenericModal>
            </section>
        </>
    )
};

export default QaTracker;