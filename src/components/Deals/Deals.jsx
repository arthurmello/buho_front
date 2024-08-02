import React, { useState, useEffect } from "react";
import { BiPlus, BiCheck, BiSolidTrash , BiFolder} from "react-icons/bi";
import styles from "./Deals.module.css";
import { deleteDeal, fetchDeals } from "../../api/deals"

const Deals = ({ userIdParam, setShowNewDealModal, deals, setDeals, selectedDeal, setSelectedDeal}) => {
  console.log(deals)
    useEffect(() => {
    fetchDeals(userIdParam, setDeals);
  }, [userIdParam]);
  
  const [uploadedFiles, setUploadedFiles] = useState([]);
  
  async function handleDelete(userIdParam, deal) {
    console.log(`Deleting deal: ${deal} for user ${userIdParam}`);
    await deleteDeal(userIdParam, deal);
    fetchDeals(userIdParam, setDeals);
  }

  async function handleClick(userIdParam, deal) {
    console.log(`Selecting deal: ${deal} for user ${userIdParam}`);
    setSelectedDeal(deal)
    console.log("selected deal at Deals:")
    console.log(selectedDeal)
    console.log(typeof selectedDeal)
  }

  return (
    <>
      <div className={styles.container}>
        <div style={{ display: "flex", gap: "10px" }}>
          <div className="sidebar-header" onClick={() => setShowNewDealModal(true)} role="button">
              <BiPlus size={20} />
              <p>New Deal</p>
          </div>
          {/* <div
            className={styles.sidebarHeader}
            onClick={handleReset}
            role="button"
            style={{ display: "flex", alignItems: "center" }}
          >
            <BiSolidTrash size={20} />
            <button>Clear files</button>
          </div> */}
        </div>
        <div className={styles.dealList}>
          {deals.map((deal) => (
            <div
              className={`${styles.deal} ${deal === selectedDeal ? styles.selectedDeal : ''}`}
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
              {/* <button
                style={{
                  marginLeft: "10px",
                  display: processStatus === "uploading" ? "block" : "none",
                }}
                onClick={() => {
                  const files = uploadedFiles.filter(
                    (item) => item !== deal
                  );
                  setUploadedFiles(files);
                  if (!files.length) {
                    setProcessStatus("pending");
                  }
                }}
              >
                X
              </button> */}
            </div>
          ))}
        </div>
        {uploadedFiles.length > 0 && processStatus !== "submitted" && (
          <div
            className={`${styles.sidebarHeader}`}
            onClick={handleSubmit}
            role="button"
            style={{
              display: "flex",
              marginTop: "20px"
            }}
          >
            <BiCheck size={20} />
            <button>Confirm</button>
          </div>
        )}
      </div>
    </>
  );
};

export default Deals;