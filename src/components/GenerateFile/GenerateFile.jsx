import React, { useState } from "react";
import "./GenerateFile.css";

const GenerateFile = ({ onFileGenerationRequest }) => {

  const filenames = ["Information Memorandum", "Credit Proposal"];

  const formatFilename = (filename) => {
    console.log(filename)
    return filename.toLowerCase().replace(/ /g, "_");
  };

  const handleRequest = async (filename) => {
    const formattedFilename = formatFilename(filename);
    onFileGenerationRequest({ filename: formattedFilename });
  };

  return (
    <form className="form">
      {filenames.map((filename, index) => (
        <button
          key={index}
          type="button"
          className="btn"
          onClick={() => handleRequest(filename)}
        >
          {filename}
        </button>
      ))}
    </form>
  );
};

export default GenerateFile;