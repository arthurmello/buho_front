export const onFileGenerationRequested = async ({ filename, setLoading, userIdParam, dealParam }) => {
    setLoading(true);
  
    try {
      // Fetch user parameters
      const userParamsResponse = await fetch(`${import.meta.env.VITE_BACK_API_URL}/output_files/user_parameters?filename=${encodeURIComponent(filename)}`);
      const userParams = await userParamsResponse.json();
  
      let user_parameters = {};
  
      if (userParams.length > 0) {
        // Open a new window to get user inputs
        const userInputWindow = window.open('', 'User Input', 'width=600,height=400');
        
        
        // Add CSS styles for the form and button
        userInputWindow.document.write(`
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: white;
              margin: 0;
              padding: 0;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
            }
            .form {
              display: flex;
              flex-direction: column;
              width: 60%;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
              background-color: #f1f3f4;
              justify-content: flex-end; 
            }
            .form-group {
              display: flex;
              flex-direction: row;
              align-items: center;
              width: 100%;
              margin-bottom: 15px;
            }
            .form label {
              width: 150px; /* Adjust this value as needed */
              margin-right: 10px;
              font-size: 1rem;
              text-align: right;
            }
            .form input[type="text"] {
              flex: 1;
              padding: 8px;
              border-radius: 3px;
              border: 1px solid #ccc;
              float: right;
              clear: both;
            }
            .btn {
              width: 100%;
              display: flex;
              align-items: center;
              gap: 1rem;
              padding: 0.8rem 1rem;
              border-radius: 0.2rem; 
              border: 0.05rem solid rgba(255, 255, 255, 0.5);
              background-color: #3d6abd;
              color: #ffffff;
              cursor: pointer;
              justify-content: center;
              font-size: clamp(0.8rem, 2.5vw, 1rem);
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              transition: background-color 0.3s ease;
            }
            .btn:hover {
              background-color: #2d4f8a;
            }
          </style>
        `);

        userInputWindow.document.write('<h4>Please enter the required parameters:</h4>');
        userInputWindow.document.write('<form id="userInputForm" class="form>');
        
        userParams.forEach(param => {
          userInputWindow.document.write(`<div class="form-group">`);
          userInputWindow.document.write(`<label for="${param}">${param}: </label>`);
          userInputWindow.document.write(`<input type="text" id="${param}" name="${param}"><br><br>`);
          userInputWindow.document.write(`</div>`);
        });
        
        userInputWindow.document.write('<input type="submit" value="Submit" class="btn">');
        userInputWindow.document.write('</form>');
        
        // Monitor the window to check if it gets closed
        const windowClosedInterval = setInterval(() => {
          if (userInputWindow.closed) {
            clearInterval(windowClosedInterval);
            setLoading(false);
          }
        }, 500);

        
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