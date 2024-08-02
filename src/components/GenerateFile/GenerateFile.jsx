import React, { useCallback, useState, useEffect } from "react";
import { fetchFileNames } from "../../api/outputFiles";
import "./GenerateFile.css";

const GenerateFile = ({ onFileGenerationRequest }) => {

  const [fileNames, setFileNames] = useState([]);

  const fetchAndSetFileNames = useCallback(async () => {
    const fetchedFileNames = await fetchFileNames();
    setFileNames(fetchedFileNames);
  }, []);

  useEffect(() => {
    fetchAndSetFileNames();
  }, [fetchAndSetFileNames]);

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