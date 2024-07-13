import React  from "react";
import "./filegenerationmodal.css";

const FileGenerationModal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <button type="button" onClick={handleClose} className="close">
        X
      </button>
      <section className="modal-main">{children}</section>
    </div>
  );
};

export default FileGenerationModal;
