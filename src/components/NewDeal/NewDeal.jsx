import React, { useRef, useState, useCallback, useEffect } from "react";
import axios from "axios";
import styles from "./NewDeal.module.css";
import { BiPlus, BiCheck, BiSolidTrash } from "react-icons/bi";
import Loader from "../Loader/Loader";

const NewDeal = ({ onNewDeal }) => {
  const inputRef = useRef();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [processStatus, setProcessStatus] = useState("pending");
  const [isLoading, setLoading] = useState(false);

  const fetchUploadedFiles = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/files/list`);
      const data = await response.json();
      console.log(data);
      setUploadedFiles(data || []);
    } catch (error) {
      console.error(error);
    }
  }, []);
  
  useEffect(() => {
    fetchUploadedFiles();
  }, [fetchUploadedFiles]);

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    uploadedFiles.forEach((file) => {
      formData.append("files", file);
    });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACK_API_URL}/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(response.data);
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
    setUploadedFiles(files);
    setProcessStatus("uploading");
    inputRef.current.value = null;
  };

  const resetUploadedFiles = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/files/reset`);
      await response.json();
      setUploadedFiles([]);
      setProcessStatus("pending"); // Reset process status to allow confirm button to reappear
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Loader show={isLoading} />
      <div className={styles.container}>
        <div style={{ display: "flex", gap: "10px" }}>
          <div
            className={styles.sidebarHeader}
            onClick={() => inputRef.current.click()}
            role="button"
            style={{ display: "flex", alignItems: "center" }}
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
            />
          </div>
          <div
            className={styles.sidebarHeader}
            onClick={resetUploadedFiles}
            role="button"
            style={{ display: "flex", alignItems: "center" }}
          >
            <BiSolidTrash size={20} />
            <button>Clear files</button>
          </div>
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

export default NewDeal;
