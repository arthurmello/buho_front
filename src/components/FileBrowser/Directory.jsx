// react
// react
import React, { useState, useRef } from "react";
import { BiFile, BiSolidTrash, BiFolder } from "react-icons/bi";

// css
import styles from "./FileBrowser.module.css";

const Directory = ({ files, handleDelete, userIdParam, dealParam, handleMove }) => {
    const [isExpanded, toggleExpanded] = useState(true);
    const [isDraggedOver, setIsDraggedOver] = useState(false);

    const folderRef = useRef(null);

    const onDragStart = (e, item) => {
        e.dataTransfer.setData("item", JSON.stringify(item));
    };

    const onDrop = (e, targetFolder) => {
        e.preventDefault();
        e.stopPropagation();
        const item = JSON.parse(e.dataTransfer.getData("item"));
        handleMove(userIdParam, dealParam, item, targetFolder);
        toggleExpanded(true);
        setIsDraggedOver(false);
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };
    const onDragEnter = (e) => {
        e.preventDefault();
        setIsDraggedOver(true);
    };

    const onDragLeave = (e) => {
        e.preventDefault();
        setIsDraggedOver(false);
    };

    if (files.type === 'folder') {
        return (
            <div 
                className={`${styles.folder} ${isDraggedOver ? styles.draggedOver : ''}`}
                ref={folderRef}
                
                onDrop={(e) => onDrop(e, files)}
                onDragOver={onDragOver}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
            >
                <div
                    className={styles.folderHeader}
                    onClick={() => toggleExpanded(!isExpanded)}
                    onDragStart={(e) => onDragStart(e, files)}
                    draggable
                >
                    <BiFolder className={styles.fileIcon} />
                    <div className={styles.folderName}>{files.name}</div>
                    <BiSolidTrash
                        className={styles.trashIcon}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(userIdParam, dealParam, files.path);
                        }}
                    />
                </div>
                {isExpanded && (
                    <div className={styles.folderContents}>
                        {files.items.map((item) => (
                            <Directory
                                key={item.name}
                                files={item}
                                handleDelete={handleDelete}
                                userIdParam={userIdParam}
                                dealParam={dealParam}
                                handleMove={handleMove}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div 
            className={styles.file} 
            draggable 
            onDragStart={(e) => onDragStart(e, files)}
        >
            <BiFile className={styles.fileIcon} />
            <div className={styles.folderName}>{files.name}</div>
            <BiSolidTrash
                className={styles.trashIcon}
                onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(userIdParam, dealParam, files.path);
                }}
            />
        </div>
    );
};

export default Directory;