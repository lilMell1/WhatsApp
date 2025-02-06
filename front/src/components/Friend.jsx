import React from 'react';
import '../css/friend.css';

const Friend = ({ username, phoneNumber, onRemove }) => {
  return (
    <div className="friend-item">
      <div className="friend-info">
        <p className="friend-name">{username}</p>
        <p className="friend-phone">{phoneNumber}</p>
      </div>
      <button className="btn-remove-friend" onClick={onRemove}>Remove</button>
    </div>
  );
};

export default Friend;
