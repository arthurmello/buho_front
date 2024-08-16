import React  from "react";
import "./genericmodal.css";

const GenericModal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <div onClick={handleClose} className="close">
        Close
      </div>
      <section className="modal-main">{children}</section>
    </div>
  );
};

export default GenericModal;
