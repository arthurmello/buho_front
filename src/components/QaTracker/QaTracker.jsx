import React, { useState, useEffect } from "react";
import { BiPlus, BiSolidTrash, BiArrowBack } from "react-icons/bi";
import { resetQaTracker, fetchQaTracker,  onQuestionSubmitted } from "../../api/qaTracker"
import GenericModal from "../GenericModal/GenericModal";
import QuestionForm from "../QuestionForm/QuestionForm";


const QaTracker = ({
    userIdParam,
    dealParam,
    setSelectedFeature
}) => {
    const [showQAModal, setShowQAModal] = useState(false);
    const [qaTracker, setQaTracker] = useState([]);
    const [owner, setOwner] = useState("");
    
    useEffect(() => {
        fetchQaTracker(userIdParam, dealParam, setQaTracker);
      }, [userIdParam, dealParam]);

    return (
        <>
            <div className="main-header">
                <BiArrowBack 
                className="arrow"
                onClick={() => setSelectedFeature("")} />
                <h3>Q&A Tracker</h3>
                <div className="sidebar-info-clear" onClick={
                    () => resetQaTracker(userIdParam, dealParam, setQaTracker)
                    }>
                    <BiSolidTrash size={20} />
                </div>
            </div>
            <div className="sidebar-history">
                {qaTracker.map((history, index) => (
                    <div
                    className="question-box"
                    key={index}
                    >
                    <p className="question-owner">{index + 1}. Question from: {history.owner}</p>
                    <p className="question-text">{history.question}</p>
                    </div>
                ))}
            </div>
            <div className="sidebar-info">
                <div className="btn" onClick={() => setShowQAModal(true)}>
                    <BiPlus size={20} fill="white"/>
                    Add Question
                </div>
            </div>
            <GenericModal show={showQAModal} handleClose={() => setShowQAModal(false)}>
                <QuestionForm
                    onQuestionSubmit={
                        (data) => onQuestionSubmitted(
                            data, userIdParam, dealParam, setQaTracker, fetchQaTracker, setShowQAModal
                        )} 
                    owner={owner}
                    setOwner={setOwner}
                />
            </GenericModal>
        </>
    )
};

export default QaTracker;