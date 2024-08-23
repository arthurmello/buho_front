export const fetchChatHistory = async (userIdParam, dealParam, setChatHistory) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/chat/history?${userIdParam}&${dealParam}`);
    const data = await response.json();
    setChatHistory(data.chat_history || []);
  } catch (error) {
    console.error(error);
  }
};

export const resetChatHistory = async (userIdParam, dealParam, setChatHistory) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/chat/history/reset?${userIdParam}&${dealParam}`);
    await response.json();
    await fetchChatHistory(userIdParam, dealParam, setChatHistory)
    // setChatHistory([]);
  } catch (error) {
    console.error(error);
  }
};

export const submitHandler = async (
  e,
  text,
  setText,
  setChatHistory,
  setIsResponseLoading,
  setErrorText,
  owner,
  userIdParam,
  dealParam,
  scrollToLastItem
) => {
  e.preventDefault();
  if (!text) return;

  setIsResponseLoading(true);
  setErrorText("");

  const newQuestionId = Date.now(); // Unique ID for the new question
  const newQuestion = {
    id: newQuestionId,
    owner,
    question: text,
    answer: "Thinking...",
    sources: [],
  };

  setChatHistory(prevHistory => [...prevHistory, newQuestion]);
  setText("");

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      owner,
      question: text,
    }),
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACK_API_URL}/chat/ask?${userIdParam}&${dealParam}`,
      options
    );

    if (response.status === 429) {
      setErrorText("Too many requests, please try again later.");
      setIsResponseLoading(false);
      return;
    }

    const data = await response.json();
    if (data.error) {
      setErrorText(data.error);
      setChatHistory(prevHistory =>
        prevHistory.map(chat =>
          chat.id === newQuestionId ? { ...chat, answer: data.error } : chat
        )
      );
    } else {
      setChatHistory(prevHistory =>
        prevHistory.map(chat =>
          chat.id === newQuestionId
            ? { ...chat, answer: data.answer, sources: data.sources }
            : chat
        )
      );
      setTimeout(() => {
        scrollToLastItem.current?.lastElementChild?.scrollIntoView({
          behavior: "smooth",
        });
      }, 1);
    }
  } catch (e) {
    setErrorText(e.message);
    console.error(e);
  } finally {
    setIsResponseLoading(false);
  }
};