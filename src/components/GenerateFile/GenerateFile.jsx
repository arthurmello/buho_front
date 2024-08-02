import React, { useCallback, useState, useEffect } from "react";
import "./GenerateFile.css";

const GenerateFile = ({ onFileGenerationRequest }) => {

  const [fileNames, setFileNames] = useState([]);

  const cleanFileNames = (fileName) => {
    let cleanFileName = fileName.replaceAll("_"," ");
    return cleanFileName.charAt(0).toUpperCase() + cleanFileName.slice(1);
  }

  const fetchFileNames = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/output_files/`);
      const data = await response.json();
      setFileNames(data.map(cleanFileNames));
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchFileNames();
  }, [fetchFileNames]);

  const formatFilename = (filename) => {
    return filename.toLowerCase().replace(/ /g, "_");
  };

  const handleRequest = async (filename) => {
    const formattedFilename = formatFilename(filename);
    onFileGenerationRequest({ filename: formattedFilename });
  };

  return (
    <form className="form">
      {fileNames.map((filename, index) => (
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