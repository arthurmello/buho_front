// react
import React, { useRef, useState, useEffect } from 'react';
import { BiArrowBack, BiPlus, BiAnalyse} from "react-icons/bi";

// components
import Directory from "./Directory"
import AddFolderForm from './AddFolderForm';
import GenericModal from "../GenericModal/GenericModal";

// api
import {
    fetchAllowedExtensions,
    fetchUploadedFiles,
    uploadFiles,
    deleteObject,
    moveObject,
    processFiles } from "../../api/inputFiles"

import { fetchDashboardData } from "../../api/dashboardData";
// css
import styles from "./FileBrowser.module.css";


const FileBrowser = ({ userIdParam, selectedDeal, setSelectedDeal, dealParam, setLoading, setDashboardData }) => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [showAddFolderModal, setShowAddFolderModal] = useState(false);
    const inputRef = useRef();
    const allowedExtensions = fetchAllowedExtensions();

    async function handleFileEvent(e) {
        e.preventDefault();
        const files = Array.prototype.slice.call(e.target.files);
        inputRef.current.value = null;
        setLoading(true)
        await uploadFiles(userIdParam, dealParam, files);
        fetchUploadedFiles(userIdParam, dealParam, setUploadedFiles);
        setLoading(false)
    };

    async function handleDelete(userIdParam, dealParam, file) {
        console.log(`Deleting file: ${file}`);
        await deleteObject(userIdParam, dealParam, file);
        fetchUploadedFiles(userIdParam, dealParam, setUploadedFiles);
    }

    const handleMove = (userIdParam, dealParam, item, targetFolder) => {
        console.log(`Moving ${item} to ${targetFolder}`);
        moveObject(userIdParam, dealParam, item, targetFolder);
        fetchUploadedFiles(userIdParam, dealParam, setUploadedFiles);
    };

    async function handleProcessFiles(userIdParam, dealParam) {
        setLoading(true)
        await processFiles(userIdParam, dealParam)
        await fetchDashboardData(userIdParam, dealParam, setDashboardData)
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
                <div className="btn" onClick={() => setShowAddFolderModal(true)}>
                    <BiPlus size={20} fill="white"/>
                    Add folder
                </div>
                <GenericModal show={showAddFolderModal} handleClose={() => setShowAddFolderModal(false)}>
                    <AddFolderForm
                        userIdParam={userIdParam}
                        deal={selectedDeal}
                        dealParam={dealParam}
                        setShowAddFolderModal={setShowAddFolderModal}
                        setUploadedFiles={setUploadedFiles}
                    />
                </GenericModal>
                <div
                    className="btn"
                    onClick={() => inputRef.current.click()}
                    style={{ display: "flex", alignItems: "center" }}
                >
                    <BiPlus size={20} fill="white" />
                    Add files
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
                    className="btn"
                    onClick={() => handleProcessFiles(userIdParam, dealParam)}
                    style={{ display: "flex", alignItems: "center" }}
                >
                    <BiAnalyse size={20} fill="white"/>
                    Process files
                </div>
        </div>
    );
};

export default FileBrowser;