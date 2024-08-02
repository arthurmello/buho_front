// src/components/FolderItem.jsx (with drag-and-drop)
import React from 'react';
import { useDrop } from 'react-dnd';
import FileItem from '../FileItem/FileItem';

const FolderItem = ({ item, addFileOrFolder, deleteItem, moveItem }) => {
    const [, drop] = useDrop({
        accept: 'file',
        drop: (draggedItem) => moveItem(draggedItem.id, item.id),
    });

    return (
        <div ref={drop}>
            <div>
                <span>{item.name}</span>
                <button onClick={() => addFileOrFolder(item.id, true)}>New Folder</button>
                <button onClick={() => addFileOrFolder(item.id, false)}>New File</button>
                {item.id !== 'root' && <button onClick={() => deleteItem(item.id)}>Delete</button>}
            </div>
            <div style={{ marginLeft: 20 }}>
                {item.children.map((child) =>
                    child.isFolder ? (
                        <FolderItem
                            key={child.id}
                            item={child}
                            addFileOrFolder={addFileOrFolder}
                            deleteItem={deleteItem}
                            moveItem={moveItem}
                        />
                    ) : (
                        <FileItem key={child.id} item={child} deleteItem={deleteItem} moveItem={moveItem} />
                    )
                )}
            </div>
        </div>
    );
};

export default FolderItem;