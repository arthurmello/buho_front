// react
import React, { useRef, useState, useEffect } from 'react';
import { BiArrowBack, BiPlus} from "react-icons/bi";

// components
import FolderItem from "../FolderItem/FolderItem"

// api
import { fetchAllowedExtensions, fetchUploadedFiles, uploadFiles } from "../../api/inputFiles"

// css
import styles from "./FileBrowser.module.css";

const FileBrowser = ({userIdParam, selectedDeal, setSelectedDeal, dealParam}) => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [processStatus, setProcessStatus] = useState("pending");
    
    const inputRef = useRef();
    const allowedExtensions = fetchAllowedExtensions();
    
    async function handleFileEvent (e) {
        e.preventDefault();
        const files = Array.prototype.slice.call(e.target.files);
        // setUploadedFiles(files);
        setProcessStatus("uploading");
        inputRef.current.value = null;
        await uploadFiles(userIdParam, dealParam, files)
        fetchUploadedFiles(userIdParam, dealParam, setUploadedFiles)
      };

    useEffect(() => {
        fetchUploadedFiles(userIdParam, dealParam, setUploadedFiles);
    }, [userIdParam, selectedDeal]);

    // const [fileSystem, setFileSystem] = useState("");
    console.log("userIdParam at FileBrowser:")
    console.log(userIdParam)
    
    console.log("selected deal at FileBrowser:")
    console.log(selectedDeal)
    console.log(typeof selectedDeal)
    return (
        <>
            <div className={styles.container}>
                <BiArrowBack 
                    className={styles.arrow}
                    onClick={() => setSelectedDeal("")} />
                <div>
                    {selectedDeal}
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
            <div
                className={styles.sidebarHeader}
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
        </>
    );
};

export default FileBrowser;

// import React, { useState } from 'react';
// import FileItem from './FileItem';
// import FolderItem from './FolderItem';

// const initialData = {
//     id: 'root',
//     name: 'root',
//     isFolder: true,
//     children: [],
// };

// const FileBrowser = () => {
//     const [fileSystem, setFileSystem] = useState(initialData);

//     const addFileOrFolder = (parentId, isFolder) => {
//         const name = prompt(`Enter ${isFolder ? 'folder' : 'file'} name:`);
//         if (name) {
//             const newItem = {
//                 id: `${parentId}-${name}`,
//                 name,
//                 isFolder,
//                 children: isFolder ? [] : undefined,
//             };
//             // TODO: Add logic to update the fileSystem state with the new item
//         }
//     };

//     const deleteItem = (itemId) => {
//         // TODO: Add logic to remove item from the fileSystem state
//     };

//     const moveItem = (itemId, targetFolderId) => {
//         // TODO: Add logic to move item within the fileSystem state
//     };

//     return (
//         <div>
//             <FolderItem
//                 item={fileSystem}
//                 addFileOrFolder={addFileOrFolder}
//                 deleteItem={deleteItem}
//                 moveItem={moveItem}
//             />
//         </div>
//     );
// };

// export default FileBrowser;