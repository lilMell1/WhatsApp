import React from 'react';
import '../css/message.css';

const Message = ({ sender, text, time }) => {
  return (
    <div className={`chat-message ${sender === 'Me' ? 'sent' : 'received'}`}>
      <p className="sender-name">{sender}</p>
      <p>{text}</p>
      <p className="message-time">{new Date(time).toLocaleTimeString()}</p>
    </div>
  );
};

export default Message;
