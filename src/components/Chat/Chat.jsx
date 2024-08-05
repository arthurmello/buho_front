import React, { useState, useEffect, useRef } from "react";
import { BiSend, BiSolidUserCircle, BiMoney } from "react-icons/bi";
import { fetchChatHistory, submitHandler } from "../../api/chat"
import ReactMarkdown from 'react-markdown';

const Chat = ({
    chatHistory,
    setChatHistory,
    text,
    setText,
    userIdParam,
    dealParam,
    owner
}) => {
    const [errorText, setErrorText] = useState("");
    const [isResponseLoading, setIsResponseLoading] = useState(false);
    const scrollToLastItem = useRef(null);

    useEffect(() => {
        fetchChatHistory(userIdParam, dealParam, setChatHistory);
    }, [userIdParam, dealParam]);


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
          
          <div className="chat-history">
            <ul>
              {chatHistory.map((chatMsg, idx) => (
                <React.Fragment key={idx}>
                  <li ref={scrollToLastItem}>
                    <div><BiSolidUserCircle size={28.8} /></div>
                    <div>
                      <p className="role-title">You (Question asked by: {chatMsg.owner})</p>
                      <p>{chatMsg.question}</p>
                    </div>
                  </li>
                  <li ref={scrollToLastItem}>
                    <div><BiMoney size={28.8} /></div>
                    <div>
                      <p className="role-title">Analyst</p>
                      <p>{chatMsg.answer}</p>
                      {chatMsg.sources && <SourceDocuments sources={chatMsg.sources} />}
                    </div>
                  </li>
                </React.Fragment>
              ))}
            </ul>
          </div>
          <div className="main-bottom">
            {errorText && <p className="errorText">{errorText}</p>}
            <form className="form-container"
                onSubmit={
                    (e) => submitHandler(
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
                        )}>
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
        </>
    )
}

export default Chat;