import axios from "axios";

export const fetchAllowedExtensions = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/input_files/allowed_extensions`);
    const extensions = await response.json();
    return extensions.join(', ');
  } catch (error) {
    console.error(error);
    return '';
  }
};

export const fetchUploadedFiles = async (userIdParam, dealParam, setUploadedFiles) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/input_files?${userIdParam}&${dealParam}`);
    const data = await response.json();
    setUploadedFiles(data)
    return data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const uploadFiles = async (userIdParam, dealParam, files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACK_API_URL}/input_files/upload?${userIdParam}&${dealParam}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to submit files.", error);
    throw error;
  }
};

export const resetUploadedFiles = async (userIdParam) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/input_files/reset?${userIdParam}`);
    await response.json();
    return [];
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const deleteObject = async (userIdParam, dealParam, obj) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACK_API_URL}/input_files/delete?${userIdParam}&${dealParam}&obj=${encodeURIComponent(obj)}`,
      null,
      {
        headers: { "accept": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to delete objects.", error);
    throw error;
  }
};

export const createFolder = async (userIdParam, dealParam, name) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACK_API_URL}/input_files/create_folder?${userIdParam}&${dealParam}&folder_path=${encodeURIComponent(name)}`,
      null,
      {
        headers: { "accept": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create folder.", error);
    throw error;
  }
};

export const moveObject = async (userIdParam, dealParam, origin, destination) => {
  try {
    const originPath = origin.path;
    let destinationPath
    if (destination) {
      destinationPath = destination.path
    } else {
      destinationPath = ''
    }

    const response = await axios.post(
      `${import.meta.env.VITE_BACK_API_URL}/input_files/move?${userIdParam}&${dealParam}`,
      {
        originPath,
        destinationPath
      },
      {
        headers: { "accept": "application/json" }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to move object.", error);
    throw error;
  }
};

export const processFiles = async (userIdParam, dealParam) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACK_API_URL}/input_files/process?${userIdParam}&${dealParam}`,
      null,
      {
        headers: { "accept": "application/json" }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to process files.", error);
    throw error;
  }
};
