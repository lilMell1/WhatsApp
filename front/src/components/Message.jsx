import React from 'react';
import '../css/message.css';

const Message = ({ sender, text, time, isMe }) => {
  return (
    <div className={`chat-message ${isMe ? 'sent' : 'received'}`}>
      <p className="sender-name">{sender}</p>
      <p>{text}</p>
      <p className="message-time">{new Date(time).toLocaleTimeString()}</p>
    </div>
  );
};

export default Message;
