import React, { useEffect } from "react";
import { BiPlus, BiSolidTrash , BiFolder} from "react-icons/bi";
import styles from "./Deals.module.css";
import "../../index.css"
import { deleteDeal, fetchDeals } from "../../api/deals"

const Deals = ({ userIdParam, setShowNewDealModal, deals, setDeals, setSelectedDeal}) => {
    useEffect(() => {
    fetchDeals(userIdParam, setDeals);
  }, [userIdParam]);
  
  
  async function handleDelete(userIdParam, deal) {
    console.log(`Deleting deal: ${deal} for user ${userIdParam}`);
    await deleteDeal(userIdParam, deal);
    fetchDeals(userIdParam, setDeals);
  }

  async function handleClick(userIdParam, deal) {
    console.log(`Selecting deal: ${deal} for user ${userIdParam}`);
    setSelectedDeal(deal)
  }

  return (
    <>
      <div className={styles.container}>
        <div style={{ display: "flex", gap: "10px" }}>
          <div className="btn" onClick={() => setShowNewDealModal(true)}>
              <BiPlus size={20} fill="white"/>
              New Deal
          </div>
        </div>
        <div className={styles.dealList}>
          {deals.map((deal) => (
            <div
              className={styles.deal}
              key={deal}
              onClick={() => handleClick(userIdParam, deal)}>
              <BiFolder />
              {deal}
              <BiSolidTrash
                className={styles.trashIcon}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(userIdParam, deal);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Deals;