import React, { useState } from "react";
import "./NewDealForm.css";

import { onDealCreation } from "../../api/deals";

const NewDealForm = ({ userIdParam, setShowNewDealModal, setDeals, fetchDeals}) => {
  const [deal, setDeal] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onDealCreation({ userIdParam, deal });
    setShowNewDealModal(false);
    setDeal("");
    fetchDeals(userIdParam, setDeals)
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-input">
        <label className="form-label" htmlFor="deal">Deal name:</label>
        <input
          id="deal"
          className="deal"
          value={deal}
          onChange={(e) => setDeal(e.target.value)}
        />
      </div>
      <button type="submit" className="btn" disabled={!deal}>
        Create
      </button>
    </form>
  );
};

export default NewDealForm;