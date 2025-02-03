import React from 'react'

const Message = ({ sender, text }) => {
    return (
      <div className="chat-message">
        <p><strong>{sender}:</strong> {text}</p>
      </div>
    );
  };

export default Message
