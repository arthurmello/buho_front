import {
  React,
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
import QAModal from "./components/QAModal/QAModal";
import QuestionForm from "./components/QuestionForm/QuestionForm";
import ReactMarkdown from 'react-markdown';
import FileGenerationModal from "./components/FileGenerationModal/FileGenerationModal";
import GenerateFile from "./components/GenerateFile/GenerateFile";
import Loader from "./components/Loader/Loader";

function App() {
  const [text, setText] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [qaTracker, setQaTracker] = useState([]);
  const [isResponseLoading, setIsResponseLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [isShowSidebar, setIsShowSidebar] = useState(false);
  const [isShowQuestionsSidebar, setIsShowQuestionsSidebar] = useState(false);
  const [owner, setOwner] = useState("User");
  const [showQAModal, setShowQAModal] = useState(false);
  const [showFileGenerationModal, setShowFileGenerationModal] = useState(false);
  const scrollToLastItem = useRef(null);
  const params = new URLSearchParams(location.search);
  const userIdParam = params.get('user') ? `user_id=${params.get('user')}` : '';
  const [isLoading, setLoading] = useState(false);
  const fetchChatHistory = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/chat/history?${userIdParam}`);
      const data = await response.json();
      setChatHistory(data.chat_history || []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchQaTracker = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/qa_tracker?${userIdParam}`);
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

  const resetQaTracker = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/qa_tracker/reset?${userIdParam}`);
      await response.json();
      setQaTracker([]);
    } catch (error) {
      console.error(error);
    }
  };

  const resetChatHistory = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/chat/history/reset?${userIdParam}`);
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
        `${import.meta.env.VITE_BACK_API_URL}/chat/ask?${userIdParam}`,
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
    setShowQAModal(false);
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
      const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/qa_tracker/add?${userIdParam}`, options);
      const data = await response.json();
      console.log(data);
      fetchQaTracker();
    } catch (error) {
      console.error(error);
    }
  };

  const onFileGenerationRequested = async ({ filename }) => {
    setShowFileGenerationModal(false);
    setLoading(true);
    console.log(filename);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filename,
      }),
    };
    console.log(options);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/output_files/generate?${userIdParam}`, options);
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
    }
     finally {
      setLoading(false)
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
      <Loader show={isLoading} />
      <div className="container">
        <section className={`sidebar ${isShowSidebar ? "open" : ""}`}>
          <NewDeal userIdParam={userIdParam}/>
          
          <div className="sidebar-info">
            
            <div
              className="sidebar-header"
              onClick={() => setShowFileGenerationModal(true)}
              role="button"
            >
              <BiPlus size={20} />
                <p>Generate file</p>
            </div>

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
              onClick={() => setShowQAModal(true)}
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

          <QAModal show={showQAModal} handleClose={() => setShowQAModal(false)}>
            <QuestionForm onQuestionSubmit={onQuestionSubmitted} />
          </QAModal>

          <FileGenerationModal show={showFileGenerationModal} handleClose={() => setShowFileGenerationModal(false)}>
            <GenerateFile onFileGenerationRequest={onFileGenerationRequested} />
          </FileGenerationModal>
          
        </section>
      </div>
    </>
  );
}

export default App;
