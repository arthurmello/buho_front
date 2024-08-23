import React, { useState } from "react";
import { createFolder, fetchUploadedFiles } from "../../api/inputFiles";

const AddFolderForm = ({ userIdParam, setShowAddFolderModal, dealParam, setUploadedFiles}) => {
  const [folder, setFolder] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    await createFolder( userIdParam, dealParam, folder );
    setFolder("");
    setShowAddFolderModal(false);
    await fetchUploadedFiles(userIdParam, dealParam, setUploadedFiles);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-input">
        <label className="form-label" htmlFor="folder">Folder name:</label>
        <input
          id="folder"
          className="folder-form-input"
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
        />
      </div>
      <button type="submit" className="btn" disabled={!folder}>
        Create
      </button>
    </form>
  );
};

export default AddFolderForm;