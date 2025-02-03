import React from 'react';
import '../css/chat.css'

const Chat = ({ messages }) => {

  return (
    <div className="chat-container">
      {/* {messages.map((msg, index) => (
        <div key={index} className="chat-message">
          <p><strong>{msg.sender} + ' ':</strong> {msg.text}</p>
        </div>
      ))} */}
    </div>
  );
};

export default Chat;
