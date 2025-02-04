import React from 'react';
import '../css/chat.css';

const Message = ({ sender, text, time }) => {
  return (
    <div className="chat-message">
      <p><strong>{sender}:</strong> {text}</p>
      <p className="message-time">{new Date(time).toLocaleTimeString()}</p>
    </div>
  );
};

export default Message;
