import React from 'react';

const Group = ({ name,lastMessage,time }) => {
  return (
    <div className="group-item">
      <p className="group-name">{name}</p>
      <p className="group-last-message">{lastMessage}</p>
      <p className="group-time-of-last-msg">{time}</p>
    </div>
  );
};

export default Group;