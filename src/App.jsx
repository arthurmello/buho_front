import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import {
  BiPlus,
  BiSend,
  BiSolidUserCircle,
  BiMoney,
  BiSolidTrash,
} from "react-icons/bi";
import { MdOutlineArrowLeft, MdOutlineArrowRight } from "react-icons/md";
import NewDeal from "./components/NewDeal/NewDeal";
import Modal from "./components/Modal/Modal";
import QuestionForm from "./components/QuestionForm/QuestionForm";
import ReactMarkdown from 'react-markdown';

function App() {
  const [text, setText] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [qaTracker, setQaTracker] = useState([]);
  const [isResponseLoading, setIsResponseLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [isShowSidebar, setIsShowSidebar] = useState(false);
  const [isShowQuestionsSidebar, setIsShowQuestionsSidebar] = useState(false);
  const [owner, setOwner] = useState("User");
  const [showModal, setShowModal] = useState(false);
  const scrollToLastItem = useRef(null);

  const fetchChatHistory = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/chat/history`);
      const data = await response.json();
      setChatHistory(data.chat_history || []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchQaTracker = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/qa_tracker`);
      const data = await response.json();
      console.log(data);
      setQaTracker(data.qa_tracker || []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchChatHistory();
  }, [fetchChatHistory]);

  useEffect(() => {
    fetchQaTracker();
  }, [fetchQaTracker]);

  const reset = async () => {
    setText("");
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/chat/history/reset`);
      await response.json();
      setChatHistory([]);
    } catch (error) {
      console.error(error);
    }
  };

  const resetQaTracker = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/qa_tracker/reset`);
      await response.json();
      setQaTracker([]);
    } catch (error) {
      console.error(error);
    }
  };

  const resetChatHistory = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/chat/history/reset`);
      await response.json();
      setChatHistory([]);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleSidebar = useCallback(() => {
    setIsShowSidebar((prev) => !prev);
  }, []);

  const toggleQuestionsSidebar = useCallback(() => {
    setIsShowQuestionsSidebar((prev) => !prev);
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!text) return;

    setChatHistory((msg) => [
      ...msg,
      {
        question: text,
        answer: "loading",
        owner: owner,
      },
    ]);

    setIsResponseLoading(true);
    setErrorText("");

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
        `${import.meta.env.VITE_BACK_API_URL}/chat/ask`,
        options
      );

      if (response.status === 429) {
        return setErrorText("Too many requests, please try again later.");
      }

      const data = await response.json();

      console.log(data);

      if (data.error) {
        setErrorText(data.error);
        setChatHistory((msg) => {
          const updatedChatHistory = [...msg];
          const lastElement = updatedChatHistory[updatedChatHistory.length - 1];
          lastElement.answer = data.error;
          return updatedChatHistory;
        });
        setText("");
      } else {
        setErrorText(false);
      }

      if (!data.error) {
        setErrorText("");
        setChatHistory((msg) => {
          const updatedChatHistory = [...msg];
          const lastElement = updatedChatHistory[updatedChatHistory.length - 1];
          lastElement.answer = data.answer;
          lastElement.sources = data.sources; // Ensure the sources are added to the state
          return updatedChatHistory;
        });
        setOwner("User");
        setTimeout(() => {
          scrollToLastItem.current?.lastElementChild?.scrollIntoView({
            behavior: "smooth",
          });
        }, 1);
        setTimeout(() => {
          setText("");
        }, 2);
      }
    } catch (e) {
      setErrorText(e.message);
      console.error(e);
    } finally {
      setIsResponseLoading(false);
    }
  };

  const onQuestionSubmitted = async ({ question, owner }) => {
    setShowModal(false);
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
      const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/qa_tracker/add`, options);
      const data = await response.json();
      console.log(data);
      fetchQaTracker(); // Fetch the updated QA tracker after a new question is added
    } catch (error) {
      console.error(error);
    }
  };

  useLayoutEffect(() => {
    const handleResize = () => {
      setIsShowSidebar(window.innerWidth <= 640);
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const SourceDocuments = ({ sources }) => {
    const formattedSources = `
\n &nbsp;
### Sources
\n &nbsp;

${sources.map(doc => `
> _"... ${doc.page_content} ..."_
\n > **File**: ${doc.file}
\n > **Page**: ${doc.page}
\n &nbsp;
`).join('\n --- \n')}
`;
    if (sources.length > 0) {
      return <ReactMarkdown>{formattedSources}</ReactMarkdown>;
    }
    return null;
  };

  return (
    <>
      <div className="container">
        <section className={`sidebar ${isShowSidebar ? "open" : ""}`}>
          <NewDeal />

          <div className="sidebar-info">

            <div className="sidebar-info-user">
              <BiSolidUserCircle size={20} />
              <p>User</p>
            </div>

            <div
            className="sidebar-info-clearchat"
            onClick={() => resetChatHistory()}
            role="button">
                <BiSolidTrash size={20} />
                <p>Clear chat</p>
            </div>
          </div>
        </section>

        <section className="main">
          <div className="empty-chat-container">
            <h1>Investment Banking Analyst</h1>
            <h3>How can I help you today?</h3>
          </div>

          {isShowSidebar ? (
            <MdOutlineArrowRight
              className="burger"
              size={28.8}
              onClick={toggleSidebar}
            />
          ) : (
            <MdOutlineArrowLeft
              className="burger"
              size={28.8}
              onClick={toggleSidebar}
            />
          )}
          {isShowQuestionsSidebar ? (
            <MdOutlineArrowLeft
              className="burger-right"
              size={28.8}
              onClick={toggleQuestionsSidebar}
            />
          ) : (
            <MdOutlineArrowRight
              className="burger-right"
              size={28.8}
              onClick={toggleQuestionsSidebar}
            />
          )}
          <div className="main-header">
            <ul>
              {chatHistory.map((chatMsg, idx) => {
                return (
                  <>
                    <li key={idx} ref={scrollToLastItem}>
                      <div>
                        <BiSolidUserCircle size={28.8} />
                      </div>
                      <div>
                        <p className="role-title">
                          You (Question asked by: {chatMsg.owner})
                        </p>
                        <p>{chatMsg.question}</p>
                      </div>
                    </li>
                    <li key={`${idx}-ai`} ref={scrollToLastItem}>
                      <div>
                        <BiMoney size={28.8} />
                      </div>
                      <div>
                        <p className="role-title">Analyst</p>
                        <p>{chatMsg.answer}</p>
                        {chatMsg.sources && <SourceDocuments sources={chatMsg.sources} />}
                      </div>
                    </li>
                  </>
                );
              })}
            </ul>
          </div>
          <div className="main-bottom">
            {errorText && <p className="errorText">{errorText}</p>}
            <form className="form-container" onSubmit={submitHandler}>
              <input
                type="text"
                placeholder="Send a message."
                spellCheck="false"
                value={isResponseLoading ? "Processing..." : text}
                onChange={(e) => setText(e.target.value)}
                readOnly={isResponseLoading}
              />
              {!isResponseLoading && (
                <button type="submit">
                  <BiSend size={20} />
                </button>
              )}
            </form>
          </div>
        </section>

        <section className={`sidebar ${isShowQuestionsSidebar ? "open" : ""}`}>
          <div className="sidebar-header" role="button">
            <p>Q&A Tracker</p>
          </div>
          <div className="sidebar-history">
            {qaTracker.map((history, index) => {
              return (
                <div
                  className="question-box"
                  onClick={() => {
                    setOwner(history.owner);
                    setText(history.question);
                  }}
                  key={index}
                >
                  <p className="question-owner">
                    {index + 1}. Question asked by: {history.owner}
                  </p>
                  <p className="question-text">{history.question}</p>
                </div>
              );
            })}
          </div>
          <div className="sidebar-info">
            <div
              className="sidebar-header"
              onClick={() => setShowModal(true)}
              role="button"
            >
              <BiPlus size={20} />
              <button>Add Question</button>
            </div>
            <div
              className="sidebar-header"
              onClick={() => resetQaTracker()}
              role="button"
            >
              <BiSolidTrash size={20} />
              <button>Clear Q&A Tracker</button>
            </div>
          </div>

          <Modal show={showModal} handleClose={() => setShowModal(false)}>
            <QuestionForm onQuestionSubmit={onQuestionSubmitted} />
          </Modal>
        </section>
      </div>
    </>
  );
}

export default App;
