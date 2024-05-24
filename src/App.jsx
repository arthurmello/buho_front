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
} from "react-icons/bi";
import { MdOutlineArrowLeft, MdOutlineArrowRight } from "react-icons/md";
import NewDeal from "./components/NewDeal/NewDeal";
import Modal from "./components/Modal/Modal";
import QuestionForm from "./components/QuestionForm/QuestionForm";
require('dotenv').config()

function App() {
  const [text, setText] = useState("");
  const [qas, setQas] = useState([]);
  const [qasTracker, setQasTracker] = useState([]);
  const [isResponseLoading, setIsResponseLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [isShowSidebar, setIsShowSidebar] = useState(false);
  const [isShowQuestionsSidebar, setIsShowQuestionsSidebar] = useState(false);
  const [owner, setOwner] = useState("User");
  const [showModal, setShowModal] = useState(false);
  const scrollToLastItem = useRef(null);

  useEffect(() => {
    const fetchQas = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/qas`);
        const data = await response.json();
        setQas(data.qas);
      } catch (error) {
        console.error(error);
      }
    };
    fetchQas();
  }, []);

  const reset = async () => {
    setText("");
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/qas/reset`);
      await response.json();
      setQas([]);
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

    setQas((qa) => [
      ...qa,
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
        `${import.meta.env.VITE_BACK_API_URL}/ask`,
        options
      );

      if (response.status === 429) {
        return setErrorText("Too many requests, please try again later.");
      }

      const data = await response.json();

      console.log(data);

      if (data.error) {
        setErrorText(data.error);
        setQas((qa) => {
          const updatedQas = [...qa];
          const lastElement = updatedQas[updatedQas.length - 1];
          lastElement.answer = data.error;
          return updatedQas;
        });
        setText("");
      } else {
        setErrorText(false);
      }

      if (!data.error) {
        setErrorText("");
        setQas((qa) => {
          const updatedQas = [...qa];
          const lastElement = updatedQas[updatedQas.length - 1];
          lastElement.answer = data.answer;
          return updatedQas;
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

  const onQuestionSubmitted = ({ question, owner }) => {
    setShowModal(false);
    setQasTracker((history) => [
      ...history,
      {
        question,
        owner,
      },
    ]);
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

  return (
    <>
      <div className="container">
        <section className={`sidebar ${isShowSidebar ? "open" : ""}`}>
          <NewDeal onNewDeal={reset} />

          <div className="sidebar-info">
            {/* <div className="sidebar-info-upgrade">
              <BiUser size={20} />
              <p>Upgrade plan</p>
            </div> */}
            <div className="sidebar-info-user">
              <BiSolidUserCircle size={20} />
              <p>User</p>
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
              {qas.map((chatMsg, idx) => {
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
            <button>Q&A Tracker</button>
          </div>
          <div className="sidebar-history">
            {qasTracker.map(({ question, owner }, index) => {
              return (
                <div
                  className="question-box"
                  onClick={() => {
                    setOwner(owner);
                    setText(question);
                  }}
                  key={index}
                >
                  <p className="question-owner">
                    {index + 1}. Question asked by: {owner}
                  </p>
                  <p className="question-text">{question}</p>
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
