import React from 'react';
import '../css/group.css'

const Group = ({ name, description, date, onOpenChat }) => {
  return (
    <button className="group-item" onClick={onOpenChat}>
      <div className="group-info">
        <p className="group-name">{name}</p>
        <p className="group-date">{new Date(date).toLocaleDateString()}</p>
      </div>
    </button>
  );
};

export default Group;
