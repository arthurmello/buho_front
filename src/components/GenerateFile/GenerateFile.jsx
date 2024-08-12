import React, { useCallback, useState, useEffect } from "react";
import { fetchFileNames } from "../../api/outputFiles";
import { BiArrowBack } from "react-icons/bi";
import "./GenerateFile.css";
import { onFileGenerationRequested } from "../../api/outputFiles";

const GenerateFile = ({
  setLoading,
  userIdParam,
  dealParam,
  setSelectedFeature
}) => {
  const onFileGenerationRequest = (data) => onFileGenerationRequested(
    { ...data, setLoading, userIdParam, dealParam}
  )
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
    <>
      <div className="main-header">
        <BiArrowBack 
        className="arrow"
        onClick={() => setSelectedFeature("")} />
        <h3 
        style={{marginRight:70}}>Generate file</h3>
      </div>

        <form>
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
    </>

  );
};

export default GenerateFile;