export const fetchQaTracker = async (userIdParam, dealParam, setQaTracker) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/qa_tracker?${userIdParam}&${dealParam}`);
      const data = await response.json();
      setQaTracker(data.qa_tracker || []);
    } catch (error) {
      console.error(error);
    }
  };
  
export const resetQaTracker = async (userIdParam, dealParam, setQaTracker) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/qa_tracker/reset?${userIdParam}&${dealParam}`);
        await response.json();
        setQaTracker([]);
    } catch (error) {
        console.error(error);
    }
    };

export const onQuestionSubmitted = async ({ question, owner },userIdParam, dealParam, setQaTracker, fetchQaTracker, setShowQAModal) => {
    const options = {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        owner,
        question,
        }),
    };
    try {
        const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/qa_tracker/add?${userIdParam}&${dealParam}`, options);
        await response.json();
        fetchQaTracker(userIdParam, dealParam, setQaTracker);
    } catch (error) {
        console.error(error);
    }
    setShowQAModal(false)
    };