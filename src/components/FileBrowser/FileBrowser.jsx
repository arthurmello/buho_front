// react
import React, { useRef, useState, useEffect } from 'react';
import { BiArrowBack, BiPlus, BiAnalyse} from "react-icons/bi";

// components
import Directory from "./Directory"

// api
import {
    fetchAllowedExtensions,
    fetchUploadedFiles,
    uploadFiles,
    deleteObject,
    createFolder,
    moveObject,
    processFiles } from "../../api/inputFiles"

// css
import styles from "./FileBrowser.module.css";

const FileBrowser = ({ userIdParam, selectedDeal, setSelectedDeal, dealParam, setLoading }) => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const inputRef = useRef();
    const allowedExtensions = fetchAllowedExtensions();

    async function handleFileEvent(e) {
        e.preventDefault();
        const files = Array.prototype.slice.call(e.target.files);
        inputRef.current.value = null;
        setLoading(true)
        await uploadFiles(userIdParam, dealParam, files);
        setLoading(false)
        fetchUploadedFiles(userIdParam, dealParam, setUploadedFiles);
    };

    async function handleDelete(userIdParam, dealParam, file) {
        console.log(`Deleting file: ${file}`);
        await deleteObject(userIdParam, dealParam, file);
        fetchUploadedFiles(userIdParam, dealParam, setUploadedFiles);
    }

    async function handleNewFolder() {
        const folderName = window.prompt("Enter the new folder name:");
        if (folderName) {
            await createFolder(userIdParam, dealParam, folderName);
        }
        fetchUploadedFiles(userIdParam, dealParam, setUploadedFiles);
    };

    const handleMove = (userIdParam, dealParam, item, targetFolder) => {
        console.log(`Moving ${item} to ${targetFolder}`);
        moveObject(userIdParam, dealParam, item, targetFolder);
        fetchUploadedFiles(userIdParam, dealParam, setUploadedFiles);
    };

    async function handleProcessFiles(userIdParam, dealParam) {
        setLoading(true)
        await processFiles(userIdParam, dealParam)
        setLoading(false)
        ;
    };
    
    const onDropOutside = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const item = JSON.parse(e.dataTransfer.getData("item"));
        handleMove(userIdParam, dealParam, item, null); // targetFolder is null indicating the root
        console.log("Moving outside!!");
    };

    useEffect(() => {
        fetchUploadedFiles(userIdParam, dealParam, setUploadedFiles);
    }, [userIdParam, selectedDeal]);

    return (
        <div className={styles.container} onDrop={onDropOutside} onDragOver={(e) => e.preventDefault()}>
            <BiArrowBack 
                className={styles.arrow}
                onClick={() => setSelectedDeal("")} />
            <div className={styles.selectedDeal}>
                {selectedDeal}
            </div>

            <div className={styles.buttonGrid}>
                <div
                    className={styles.addObjButton}
                    onClick={handleNewFolder}
                    role="button"
                    style={{ display: "flex", alignItems: "center" }}
                >
                    <BiPlus size={20} />
                    <button>New folders</button>
                </div>

                <div
                    className={styles.addObjButton}
                    onClick={() => inputRef.current.click()}
                    role="button"
                    style={{ display: "flex", alignItems: "center" }}
                >
                    <BiPlus size={20} />
                    <button>Add files</button>
                    <input
                        ref={inputRef}
                        type="file"
                        multiple
                        accept={allowedExtensions}
                        style={{ display: "none" }}
                        onChange={handleFileEvent}
                    />
                </div>
            </div>
            <div className={styles.folderContainer}>
                {uploadedFiles.map(
                    (item) => <Directory key={item.name}
                        files={item}
                        handleDelete={handleDelete}
                        userIdParam={userIdParam}
                        dealParam={dealParam}
                        handleMove={handleMove}
                    />)}
            </div>
                <div
                    className={styles.addObjButton}
                    onClick={() => handleProcessFiles(userIdParam, dealParam)}
                    role="button"
                    style={{ display: "flex", alignItems: "center" }}
                >
                    <BiAnalyse size={20} />
                    <button>Process files</button>
                </div>
        </div>
    );
};

export default FileBrowser;