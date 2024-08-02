// src/components/FileItem.jsx (with drag-and-drop)
import React from 'react';
import { useDrag } from 'react-dnd';

const FileItem = ({ item, deleteItem, moveItem }) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'file',
        item: { id: item.id, type: 'file' },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    return (
        <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
            <span>{item.name}</span>
            <button onClick={() => deleteItem(item.id)}>Delete</button>
        </div>
    );
};

export default FileItem;