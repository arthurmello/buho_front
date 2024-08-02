export const onFileGenerationRequested = async ({ filename, setShowFileGenerationModal, setLoading, userIdParam, dealParam }) => {
    setShowFileGenerationModal(false);
    setLoading(true);
    console.log(filename);
  
    try {
      // Fetch user parameters
      const userParamsResponse = await fetch(`${import.meta.env.VITE_BACK_API_URL}/output_files/user_parameters?filename=${encodeURIComponent(filename)}`);
      const userParams = await userParamsResponse.json();
  
      let user_parameters = {};
  
      if (userParams.length > 0) {
        // Open a new window to get user inputs
        const userInputWindow = window.open('', 'User Input', 'width=600,height=400');
        userInputWindow.document.write('<h2>Please enter the required parameters:</h2>');
        userInputWindow.document.write('<form id="userInputForm">');
        
        userParams.forEach(param => {
          userInputWindow.document.write(`<label for="${param}">${param}:</label>`);
          userInputWindow.document.write(`<input type="text" id="${param}" name="${param}"><br><br>`);
        });
        
        userInputWindow.document.write('<input type="submit" value="Submit">');
        userInputWindow.document.write('</form>');
  
        // Wait for user to submit the form
        await new Promise((resolve) => {
          userInputWindow.document.getElementById('userInputForm').onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            userParams.forEach(param => {
              user_parameters[param] = formData.get(param);
            });
            userInputWindow.close();
            resolve();
          };
        });
      }
  
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename,
          user_parameters,
        }),
      };
      console.log(options);
      const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/output_files/generate?${userIdParam}&${dealParam}`, options);
      const blob = await response.blob();
  
      // Create a link to download the file
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${filename}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

export const fetchFileNames = async () => {
  const cleanFileNames = (fileName) => {
    let cleanFileName = fileName.replaceAll("_", " ");
    return cleanFileName.charAt(0).toUpperCase() + cleanFileName.slice(1);
  };

  try {
    const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/output_files/`);
    const data = await response.json();
    return data.map(cleanFileNames);
  } catch (error) {
    console.error(error);
    return [];
  }
};