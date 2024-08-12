import React, { useState, useEffect, useRef } from "react";
import { BiSend, BiSolidUserCircle, BiSolidTrash, BiArrowBack } from "react-icons/bi";
import { fetchChatHistory, submitHandler, resetChatHistory } from "../../api/chat";
import ReactMarkdown from 'react-markdown';

const Chat = ({
  userIdParam,
  dealParam,
  setSelectedFeature
}) => {
  const [errorText, setErrorText] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [text, setText] = useState("");
  
  const [isResponseLoading, setIsResponseLoading] = useState(false);
  const scrollToLastItem = useRef(null);
  const isChatHistoryEmpty = Object.keys(chatHistory).length === 0 && chatHistory.constructor === Object;

  const owner = userIdParam.replace("user=","")

  useEffect(() => {
    fetchChatHistory(userIdParam, dealParam, setChatHistory);
  }, [userIdParam, dealParam]);

  const handleSubmit = async (e) => {
    await submitHandler(
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
    );
  };

  useEffect(() => {
    fetchChatHistory(userIdParam, dealParam, setChatHistory);
  }, [userIdParam, dealParam]);

  function TextWithLineBreaks(props) {
    const textWithBreaks = props.text.split('\n').map((text, index) => (
      <React.Fragment key={index}>
        {text}
        <br />
      </React.Fragment>
    ));
    return <div className="chat-message">{textWithBreaks}</div>;
  }

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
      return <ReactMarkdown className="chat-source">{formattedSources}</ReactMarkdown>;
    }
    return null;
  };
  
  return (
    <>
      <div className="main-header">
          <BiArrowBack 
          className="arrow"
          onClick={() => setSelectedFeature("")} />
          <h3>Chat</h3>
          <div className="sidebar-info-clearchat" onClick={
            () => resetChatHistory(userIdParam, dealParam, setChatHistory)
            }>
            <BiSolidTrash size={20} />
          </div>
      </div>
      {!isChatHistoryEmpty && (<div className="chat-history">
        <ul>
          {chatHistory.map((chatMsg, idx) => (
            <React.Fragment key={chatMsg.id || idx}>
              <li ref={scrollToLastItem}>
                <div><BiSolidUserCircle size={28.8} /></div>
                <div>
                  <p className="role-title">{chatMsg.owner}</p>
                  <p>{chatMsg.question}</p>
                </div>
              </li>
              <li ref={scrollToLastItem}>
                <div>
                  <p className="role-title">Arlo</p>
                  <TextWithLineBreaks text={chatMsg.answer}/>
                  {chatMsg.sources && <SourceDocuments sources={chatMsg.sources} />}
                </div>
              </li>
            </React.Fragment>
          ))}
        </ul>
      </div>)}
      <div className="chat-input-main">
        {errorText && <p className="errorText">{errorText}</p>}
        <form className="chat-input-form" onSubmit={handleSubmit}>
          <textarea
            type="text"
            placeholder="Send a message."
            spellCheck="false"
            value={isResponseLoading ? "Processing..." : text}
            onChange={(e) => {
              setText(e.target.value);
              e.target.style.height = 'auto'; // Reset the height
              e.target.style.height = e.target.scrollHeight + 'px'; // Set new height based on scrollHeight
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); // Prevents adding a new line
                handleSubmit(e); // Triggers the form submission
              }
            }}
            readOnly={isResponseLoading}
            rows={3} // Initial row count
            style={{ overflow: 'hidden', resize: 'none' }} // Hide overflow
          />
          {!isResponseLoading && (
            <button type="submit" className="submitButton">
              <BiSend size={20} />
            </button>
          )}
        </form>
      </div>
    </>
  );
};

export default Chat;