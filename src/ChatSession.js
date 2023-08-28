// ChatSession.js

import React from "react";

const ChatSession = ({ messages }) => {
  return (
    <div className="output">
      {messages.map((chat, index) => (
        <div key={index}>
        <p className={`${chat.by} ${isDropdownOpen ? 'hovered' : ''}`}
                  // className={`${chat.by} ff`}
                  onClick={() => handleChatClick(index)}
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  {chat.content}
                  {chat.metadata && isDropdownOpen && clickedChatIndex != index && <span className="dropdown-icon">&#9660;</span>}
                  {chat.metadata && isDropdownOpen && clickedChatIndex === index && <span className="dropdown-icon">&#9650;</span>}
                </p>
                {chat.metadata && clickedChatIndex === index && (
                  <div className="sourceView">
                    {chat.metadata && chat.metadata.map((item, idx) => (
                      <p key={idx}><span className="sourceViewReference">Reference {Object.keys(item)[0]}:</span> {Object.values(item)[0]}</p>
                    ))}
                  </div>
                )}
        </div>
      ))}
    </div>
  );
};

export default ChatSession;
