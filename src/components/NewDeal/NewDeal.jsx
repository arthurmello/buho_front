import React, { useRef, useState } from "react";
import axios from "axios";
import styles from "./NewDeal.module.css";
import { BiPlus, BiCheck } from "react-icons/bi";
import Loader from "../Loader/Loader";

const NewDeal = ({ onNewDeal }) => {
  const inputRef = useRef();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileLimit, setFileLimit] = useState(false);
  const [processStatus, setProcessStatus] = useState("pending");
  const [cost, setCost] = useState(0);
  const [isLoading, setLoading] = useState(false);

  const reset = () => {
    setUploadedFiles([]);
    setCost(0);
    onNewDeal();
    setFileLimit(false);
    setProcessStatus("pending");
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    uploadedFiles.forEach((file) => {
      formData.append("files", file);
    });
    try {
      const response = await axios.post(
        `${process.env.VITE_BACK_API_URL}/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(response.data);
      setCost(response.data.cost ?? 0);
      setProcessStatus("submitted");
    } catch (error) {
      console.error("Failed to submit files.", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileEvent = (e) => {
    e.preventDefault();
    const files = Array.prototype.slice.call(e.target.files);
    if (files.length > 5) {
      setFileLimit(true);
      return;
    }
    setUploadedFiles(files);
    setProcessStatus("uploading");
    inputRef.current.value = null;
  };

  return (
    <>
      <Loader show={isLoading} />
      <div>
        {/* <div
          className={styles.sidebarHeader}
          onClick={reset}
          role="button"
          style={{ display: processStatus === "submitted" ? "flex" : "none" }}
        >
          <BiReset size={20} />
          <button>start a New Deal</button>
        </div> */}
        <div
          className={styles.sidebarHeader}
          onClick={() => inputRef.current.click()}
          role="button"
          style={{ display: processStatus === "pending" ? "flex" : "none" }}
        >
          <BiPlus size={20} />
          <button>New Deal</button>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".pdf, .txt, .docx"
            style={{ display: "none" }}
            onChange={handleFileEvent}
            disabled={fileLimit}
          />
        </div>
        <div
          className={styles.sidebarHeader}
          onClick={handleSubmit}
          role="button"
          style={{ display: processStatus === "uploading" ? "flex" : "none" }}
        >
          <BiCheck size={20} />
          <button>Confirm</button>
        </div>
        <div className={styles.uploadedFilesList}>
          {uploadedFiles.map((file) => (
            <div className={styles.uploadedFileItem} key={file.name}>
              {file.name}
              <button
                style={{
                  marginLeft: "10px",
                  display: processStatus === "uploading" ? "block" : "none",
                }}
                onClick={() => {
                  const files = uploadedFiles.filter(
                    (item) => item.name !== file.name
                  );
                  setUploadedFiles(files);
                  if (!files.length) {
                    setProcessStatus("pending");
                  }
                }}
              >
                X
              </button>
            </div>
          ))}
        </div>
        <div
          className={styles.cost}
          style={{ display: cost ? "flex" : "none" }}
        >
          Cost: {cost.toFixed(7)} USD
        </div>
      </div>
    </>
  );
};

export default NewDeal;
