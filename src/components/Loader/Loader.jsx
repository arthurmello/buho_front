import React  from "react";
import "./Loader.css";

const Loader = ({ show }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <div className="loader"></div>
      </section>
    </div>
  );
};

export default Loader;
